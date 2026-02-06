import { NextResponse } from 'next/server';
import { searchGames } from '@/lib/igdb';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query, platformId } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const games = await searchGames(query, platformId);
        return NextResponse.json(games);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
