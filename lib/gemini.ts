import { z } from 'zod';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiConfig {
    apiKey: string;
    model?: string;
}

export interface GenerateOptions {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
    responseMimeType?: string;
    responseSchema?: object;
}

export class GeminiClient {
    private apiKey: string;
    private model: string;

    constructor(config: GeminiConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'gemini-2.5-flash';
    }

    async generateContent(
        prompt: string,
        options: GenerateOptions = {}
    ): Promise<string> {
        const url = `${GEMINI_BASE_URL}/models/${this.model}:generateContent`;

        const body: any = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],

            generationConfig: {
                temperature: options.temperature ?? 0.2,
                maxOutputTokens: options.maxOutputTokens ?? 4096,
                topP: options.topP ?? 0.95,
                topK: options.topK ?? 40,
                responseMimeType: options.responseMimeType || 'text/plain',
            },
        };

        if (options.responseSchema) {
            body.generationConfig.responseMimeType = 'application/json';
            body.generationConfig.responseSchema = options.responseSchema;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText || 'Unknown error';
            
            if (response.status === 429) {
                throw new Error('API Quota Exceeded: You have reached your Gemini API limit. Please check your billing status or try again later, or provide your own API key in Settings.');
            }
            
            throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error('Unexpected response format from Gemini API');
    }

    async generateStructured<T>(
        prompt: string,
        schema: z.ZodSchema<T>,
        options: GenerateOptions = {}
    ): Promise<T> {
        const jsonSchema = zodToJsonSchema(schema);
        const text = await this.generateContent(prompt, {
            ...options,
            responseMimeType: 'application/json',
            responseSchema: jsonSchema,
        });

        try {
            const parsed = JSON.parse(text);
            return schema.parse(parsed);
        } 
        catch (e) {
            console.error('Failed to parse structured output:', e);
            console.error('Raw text:', text);
            throw new Error('Failed to parse structured output from Gemini');
        }
    }

    async embedContent(text: string): Promise<number[]> {
        const url = `${GEMINI_BASE_URL}/models/gemini-embedding-2:embedContent`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey,
            },

            body: JSON.stringify({
                model: 'models/gemini-embedding-2',
                content: {
                    parts: [{ text }],
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText || 'Unknown error';

            if (response.status === 429) {
                throw new Error('API Quota Exceeded: You have reached your Gemini API limit. Please check your billing status or try again later, or provide your own API key in Settings.');
            }

            throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        return data.embedding?.values || [];
    }

    async batchEmbedContents(texts: string[]): Promise<number[][]> {
        const url = `${GEMINI_BASE_URL}/models/gemini-embedding-2:batchEmbedContents`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey,
            },
            
            body: JSON.stringify({
                requests: texts.map(text => ({
                    model: 'models/gemini-embedding-2',
                    content: {
                        parts: [{ text }],
                    },
                })),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText || 'Unknown error';

            if (response.status === 429) {
                throw new Error('API Quota Exceeded: You have reached your Gemini API limit. Please check your billing status or try again later, or provide your own API key in Settings.');
            }

            throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        return (data.embeddings || []).map((e: any) => e.values || []);
    }
}

function zodToJsonSchema(schema: z.ZodSchema<any>): object {
    // Simplified Zod to JSON Schema converter for common types
    const type = schema as any;

    if (type instanceof z.ZodObject) {
        const shape = type.shape;
        const properties: Record<string, any> = {};
        const required: string[] = [];

        for (const [key, value] of Object.entries(shape)) {
            properties[key] = zodToJsonSchema(value as z.ZodTypeAny);
            if (!(value instanceof z.ZodOptional)) {
                required.push(key);
            }
        }

        return {
            type: 'object',
            properties,
            required,
        };
    }

    if (type instanceof z.ZodArray) {
        return {
            type: 'array',
            items: zodToJsonSchema(type.element as any),
        };
    }

    if (type instanceof z.ZodString) {
        return { type: 'string' };
    }

    if (type instanceof z.ZodNumber) {
        return { type: 'number' };
    }

    if (type instanceof z.ZodBoolean) {
        return { type: 'boolean' };
    }

    if (type instanceof z.ZodEnum) {
        return { type: 'string', enum: type.options };
    }

    if (type instanceof z.ZodOptional) {
        return zodToJsonSchema(type.unwrap() as any);
    }

    return { type: 'string' };
}

function zodTypeToSchema(type: z.ZodTypeAny): object {
    if (type instanceof z.ZodObject) {
        const shape = type.shape;
        const properties: Record<string, any> = {};
        const required: string[] = [];

        for (const [key, value] of Object.entries(shape)) {
            properties[key] = zodTypeToSchema(value as z.ZodTypeAny);
            if (!(value instanceof z.ZodOptional)) {
                required.push(key);
            }
        }

        return {
            type: 'object',
            properties,
            required,
        };
    }

    if (type instanceof z.ZodArray) {
        return {
            type: 'array',
            items: zodTypeToSchema(type.element as any),
        };
    }

    if (type instanceof z.ZodString) return { type: 'string' };
    if (type instanceof z.ZodNumber) return { type: 'number' };
    if (type instanceof z.ZodBoolean) return { type: 'boolean' };
    if (type instanceof z.ZodEnum) return { type: 'string', enum: type.options };
    if (type instanceof z.ZodOptional) return zodTypeToSchema(type.unwrap() as any);

    return { type: 'string' };
}
