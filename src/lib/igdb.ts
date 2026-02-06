export const IGDB_BASE_URL = 'https://api.igdb.com/v4';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

let accessToken = '';

async function getAccessToken() {
    if (accessToken) return accessToken;

    const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing IGDB credentials');
    }

    const response = await fetch(
        `${TWITCH_AUTH_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
    );

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
}

export async function searchGames(query: string, platformId?: number) {
    const token = await getAccessToken();
    const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID!;

    // Basic query fields
    let body = `fields name, cover.url, platforms.name, first_release_date; where name ~ *"${query}"*; limit 20;`;

    // Create a filter for platforms if provided
    // Note: IGDB platform IDs: N64 (4), SNES (19), NES (18), GameCube (21), Wii (5), WiiU (41),
    // GB (33), GBA (24), DS (20), 3DS (137), PS1 (7), PS2 (8), PS3 (9)
    if (platformId) {
        body = `fields name, cover.url, platforms.name, first_release_date; where name ~ *"${query}"* & platforms = (${platformId}); limit 20;`;
    }

    // Sort by popularity or release date if needed, but default search relevance is usually okay.
    // We want to ensure we get covers.
    body += ' where cover != null;';

    const response = await fetch(`${IGDB_BASE_URL}/games`, {
        method: 'POST',
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain',
        },
        body,
    });

    return response.json();
}
