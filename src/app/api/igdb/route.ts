import { NextResponse } from 'next/server';

export const runtime = 'edge';

const IGDB_BASE_URL = 'https://api.igdb.com/v4';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Supported Platform IDs
const SUPPORTED_PLATFORMS = [
    18, // NES
    19, // SNES
    4,  // N64
    21, // GameCube
    5,  // Wii
    41, // Wii U
    33, // GameBoy
    24, // GBA
    20, // DS
    137, // 3DS
    7,  // PS1
    8,  // PS2
    9   // PS3
];

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    // CORRECCIÓN: Se eliminó "NEXT_PUBLIC_" para que coincida con Netlify
    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('IGDB Credentials missing in Netlify Environment Variables');
    }

    try {
        const response = await fetch(
            `${TWITCH_AUTH_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
            { method: 'POST' }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error("Twitch Auth Failed:", err);
            throw new Error(`Auth failed: ${response.statusText}`);
        }

        const data = await response.json();
        cachedToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000);

        return cachedToken;
    } catch (error) {
        console.error("IGDB Auth Error Critical:", error);
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const { query, platformId } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }

        const token = await getAccessToken();

        // CORRECCIÓN: Se eliminó "NEXT_PUBLIC_" aquí también
        const clientId = process.env.IGDB_CLIENT_ID!;

        let whereClause = `name ~ *"${query}"* & cover != null`;

        if (platformId) {
            whereClause += ` & platforms = (${platformId})`;
        } else {
            whereClause += ` & platforms = (${SUPPORTED_PLATFORMS.join(',')})`;
        }

        const body = `fields name, cover.url, platforms.name, first_release_date; where ${whereClause}; limit 50;`;

        const igdbRes = await fetch(`${IGDB_BASE_URL}/games`, {
            method: 'POST',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
            body,
        });

        if (!igdbRes.ok) {
            console.error("IGDB Fetch Error:", await igdbRes.text());
            return NextResponse.json({ error: 'IGDB API Error' }, { status: igdbRes.status });
        }

        const data = await igdbRes.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}