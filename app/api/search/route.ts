import { NextRequest, NextResponse } from 'next/server';
import { VectorStore } from '@/lib/vector-store';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, apiKey, topK = 5 } = body;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key is required' },
                { status: 400 }
            );
        }

        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            );
        }

        const store = new VectorStore(apiKey);
        await store.initialize();
        const results = await store.search(query.trim(), topK);

        return NextResponse.json({
            success: true,
            data: results,
            query: query.trim(),
        });
    } 
    catch (error: any) {
        console.error('Search error:', error);
        
        return NextResponse.json(
            { error: error.message || 'Search failed' },
            { status: 500 }
        );
    }
}
