import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { ingredient, dosage, apiKey: userApiKey } = body;
        
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key is required. Please set GEMINI_API_KEY in .env or provide it in Settings.' },
                { status: 400 }
            );
        }

        const client = new GeminiClient({ apiKey, model: 'gemini-2.5-flash' });

        const prompt = `Validate the following supplement ingredient and dosage. Provide a quick safety and regulatory assessment.
                        Ingredient: ${ingredient}
                        Dosage: ${dosage}
        
                        Return a JSON object with:
                        - isValid: boolean (whether the dosage is within safe/standard ranges)
                        - riskLevel: "low" | "medium" | "high" | "critical"
                        - standardRange: string (typical standard dosage range)
                        - warnings: array of strings (any safety warnings)
                        - interactions: array of strings (common interactions to watch for)
                        - regulatoryStatus: string (GRAS, novel food, restricted, etc.)
                        - reasoning: string (brief explanation of assessment)
                    `

        const responseSchema = {
            type: 'object',

            properties: {
                isValid: { type: 'boolean' },
                riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                standardRange: { type: 'string' },
                warnings: { type: 'array', items: { type: 'string' } },
                interactions: { type: 'array', items: { type: 'string' } },
                regulatoryStatus: { type: 'string' },
                reasoning: { type: 'string' },
            },

            required: ['isValid', 'riskLevel', 'standardRange', 'warnings', 'interactions', 'regulatoryStatus', 'reasoning'],
        };

        const resultText = await client.generateContent(prompt, {
            temperature: 0.1,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
            responseSchema,
        });

        const parsed = JSON.parse(resultText);

        return NextResponse.json({
            success: true,
            data: parsed,
        });
    } 
    catch (error: any) {
        console.error('Validation error:', error);
        
        return NextResponse.json(
            { error: error.message || 'Validation failed' },
            { status: 500 }
        );
    }
}
