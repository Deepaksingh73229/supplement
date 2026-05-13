import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';
import { z } from 'zod';

const AnalysisSchema = z.object({
    ingredients: z.array(z.object(
        {
            name: z.string(),
            dosage: z.string(),
            dosageMg: z.number().optional(),
            unit: z.string().optional(),
            category: z.string().optional(),
            description: z.string().optional(),
            isNovel: z.boolean().optional(),
            riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
            riskReason: z.string().optional(),
            standardDosage: z.string().optional(),
            interactions: z.array(z.string()).optional(),
        }
    )),

    observations: z.array(z.object(
        {
            id: z.string(),
            type: z.enum(['positive', 'negative', 'neutral', 'warning']),
            title: z.string(),
            description: z.string(),
            category: z.enum(['synergy', 'redundancy', 'gap', 'safety', 'efficacy', 'stability']),
            severity: z.enum(['low', 'medium', 'high']).optional(),
        }
    )),

    claims: z.array(z.object(
        {
            claim: z.string(),
            isProblematic: z.boolean(),
            reason: z.string(),
            severity: z.enum(['low', 'medium', 'high']),
            regulation: z.string().optional(),
            suggestion: z.string().optional(),
        }
    )),

    overallRisk: z.enum(['low', 'medium', 'high', 'critical']),
    overallScore: z.number(),
    aiReview: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productName, category, ingredientsText, marketingClaims, apiKey: userApiKey } = body;
        
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key is required. Please set GEMINI_API_KEY in .env or provide it in Settings.' },
                { status: 400 }
            );
        }

        const client = new GeminiClient({ apiKey, model: 'gemini-2.5-flash' });

        // Build the analysis prompt
        const claimsSection = marketingClaims
            ? `\n\nMarketing Claims to Review:\n${marketingClaims}`
            : '';

        const prompt = `You are an expert nutraceutical formulation analyst and regulatory consultant. Analyze the following supplement product and provide a comprehensive structured review.

                       Product Name: ${productName}
                       Category: ${category}

                       Ingredient List with Dosages:
                       ${ingredientsText}
                       ${claimsSection}

                       Please analyze this formulation and return a JSON object with the following structure:

                       1. **ingredients**: Array of structured ingredient data. For each ingredient:
                          - Extract name, dosage, and unit
                          - Categorize (Vitamins, Minerals, Amino Acids, Herbal Extracts, Probiotics, Enzymes, Fatty Acids, Antioxidants, Adaptogens, Nootropics, Other)
                          - Flag if the ingredient is unusual/novel/rarely used
                          - Assess risk level (low/medium/high/critical) based on dosage appropriateness, known side effects, and regulatory status
                          - Provide standard dosage range for comparison
                          - List potential interactions with other ingredients in this formulation

                       2. **observations**: Array of formulation observations covering:
                          - Synergies between ingredients
                          - Redundancies (duplicate mechanisms)
                          - Gaps (missing complementary ingredients)
                          - Safety concerns
                          - Efficacy issues
                          - Stability concerns
                          Each observation should have type (positive/negative/neutral/warning), title, description, category, and severity.

                       3. **claims**: Array of marketing claim reviews. For each claim:
                          - Identify if it's problematic (unsubstantiated, misleading, or regulatory violation)
                          - Explain the reason
                          - Severity level
                          - Reference relevant regulation (FDA, FTC, EFSA, etc.)
                             - Suggest compliant alternative wording (keep to 1 sentence)

                       4. **overallRisk**: Overall risk assessment (low/medium/high/critical)

                       5. **overallScore**: Numerical score 0-100 based on formulation quality, safety, and regulatory compliance

                       6. **aiReview**: A concise 1-2 paragraph professional review summary suitable for a regulatory report

                       IMPORTANT: Keep all descriptions, reasons, and title fields very concise (maximum 1-2 sentences). Do not exceed output size limits. Be thorough but brief, evidence-based, and conservative in risk assessments. Consider FDA regulations, GRAS status, and typical supplement industry standards.
                    `;

        const responseSchema = {
            type: 'object',
            properties: {
                ingredients: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            dosage: { type: 'string' },
                            dosageMg: { type: 'number' },
                            unit: { type: 'string' },
                            category: { type: 'string' },
                            description: { type: 'string' },
                            isNovel: { type: 'boolean' },
                            riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                            riskReason: { type: 'string' },
                            standardDosage: { type: 'string' },
                            interactions: { type: 'array', items: { type: 'string' } },
                        },
                        required: ['name', 'dosage'],
                    },
                },

                observations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string', enum: ['positive', 'negative', 'neutral', 'warning'] },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            category: { type: 'string', enum: ['synergy', 'redundancy', 'gap', 'safety', 'efficacy', 'stability'] },
                            severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                        },
                        required: ['id', 'type', 'title', 'description', 'category'],
                    },
                },

                claims: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            claim: { type: 'string' },
                            isProblematic: { type: 'boolean' },
                            reason: { type: 'string' },
                            severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                            regulation: { type: 'string' },
                            suggestion: { type: 'string' },
                        },
                        required: ['claim', 'isProblematic', 'reason', 'severity'],
                    },
                },

                overallRisk: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                overallScore: { type: 'number' },
                aiReview: { type: 'string' },
            },

            required: ['ingredients', 'observations', 'claims', 'overallRisk', 'overallScore', 'aiReview'],
        };

        const resultText = await client.generateContent(prompt, {
            temperature: 0.1,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        });

        let cleanText = resultText.trim();

        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.substring(7);
        }
        else if (cleanText.startsWith('```')) {
            cleanText = cleanText.substring(3);
        }

        if (cleanText.endsWith('```')) {
            cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanText);
        } 
        catch (e) {
            console.error('Failed to parse JSON. Raw text length:', cleanText.length);
            throw new Error('Invalid JSON response from AI model');
        }

        const validated = AnalysisSchema.parse(parsed);

        return NextResponse.json({
            success: true,
            data: validated,
        });
    } 
    catch (error: any) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: error.message || 'Analysis failed' },
            { status: 500 }
        );
    }
}
