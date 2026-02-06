import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1"
];

const getRandomAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

function calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 1.0;

    const normalize = (s: string) =>
        s
            .replace(/[:\-–—]/g, " ")
            .replace(/\s+/g, " ")
            .replace(/['"]/g, "")
            .trim();

    const n1 = normalize(s1);
    const n2 = normalize(s2);
    if (n1 === n2) return 0.95;

    const words1 = n1.split(" ");
    const words2 = n2.split(" ");
    const commonWords = words1.filter((w) => words2.includes(w)).length;
    const totalWords = Math.max(words1.length, words2.length);
    return commonWords / totalWords;
}

function normalizePlatform(platform: string): string {
    const cleaned = platform
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\n/g, " ")
        .trim();

    const map: Record<string, string[]> = {
        playstation: ["ps1", "psx", "playstation", "playstation 1", "sony playstation"],
        "playstation-2": ["ps2", "playstation 2"],
        "nintendo-64": ["n64", "nintendo 64", "nintendo64"],
        gamecube: ["gc", "gamecube", "game cube", "ngc"],
        "super-nintendo": ["snes", "super nintendo", "super nes"],
        nes: ["nes", "nintendo entertainment system"],
        xbox: ["xbox", "microsoft xbox"],
        wii: ["wii", "nintendo wii"],
    };

    for (const [standard, aliases] of Object.entries(map)) {
        if (aliases.some((alias) => cleaned.includes(alias) || alias.includes(cleaned))) {
            return standard;
        }
    }
    return cleaned;
}

function parseMoney(text: string): number {
    const cleaned = (text || "").replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Extrae precios de la sección "Full Price Guide"
 * que aparece como tabla: |Loose|$xx|, |Item & Box|$xx|, |Complete|$xx|, |New|$xx|
 */
function extractFullPriceGuide($: cheerio.CheerioAPI) {
    const out: Record<string, number> = {};

    // Buscamos la tabla que contiene la fila "Full Price Guide" cerca.
    // En la práctica: hay varias tablas; esta es una tabla de 2 columnas repetidas.
    // Estrategia: tomar todas las filas <tr> que tengan exactamente 2 <td>/<th> con key/value.
    $("tr").each((_, tr) => {
        const cells = $(tr).find("th,td");
        if (cells.length !== 2) return;

        const key = $(cells[0]).text().replace(/\s+/g, " ").trim();
        const val = $(cells[1]).text().replace(/\s+/g, " ").trim();

        // Nos interesan estas llaves exactas (como salen en la página en inglés)
        if (key === "Loose" || key === "Item & Box" || key === "Complete" || key === "New") {
            out[key] = parseMoney(val);
        }
    });

    return {
        marketLoose: out["Loose"] || 0,
        marketItemBox: out["Item & Box"] || 0,
        marketComplete: out["Complete"] || 0,
        marketNew: out["New"] || 0,
    };
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const platform = searchParams.get("platform")?.toLowerCase() || "";

    if (!title) return NextResponse.json({ error: "No title" }, { status: 400 });

    try {
        await delay(300 + Math.random() * 200);

        const searchQuery = encodeURIComponent(title);
        const searchUrl = `https://www.pricecharting.com/search-products?type=prices&q=${searchQuery}`;

        const { data: searchData } = await axios.get(searchUrl, {
            httpsAgent: agent,
            timeout: 8000,
            headers: {
                "User-Agent": getRandomAgent(),
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            },
        });

        const $search = cheerio.load(searchData);

        interface Candidate {
            link: string;
            title: string;
            platform: string;
            score: number;
        }

        const candidates: Candidate[] = [];
        const normalizedSearchPlatform = normalizePlatform(platform);
        const rows = $search("#games_table tbody tr");

        rows.each((_, row) => {
            const $row = $search(row);

            const titleCell = $row.find("td").eq(1);
            const platformCell = $row.find("td").eq(2);

            const gameTitle = titleCell.find("a").text().trim() || titleCell.text().trim();
            const gamePlatform = platformCell
                .text()
                .replace(/\s+/g, " ")
                .replace(/\n/g, " ")
                .trim()
                .toLowerCase();

            const link = titleCell.find("a").attr("href") || "";
            if (!link || !gameTitle) return;

            const titleScore = calculateSimilarity(title, gameTitle);
            const platformMatches = normalizePlatform(gamePlatform) === normalizedSearchPlatform;

            const finalScore = titleScore + (platformMatches ? 0.3 : 0);

            if ((titleScore >= 0.5 && platformMatches) || titleScore >= 0.85) {
                candidates.push({
                    link: link.startsWith("http") ? link : `https://www.pricecharting.com${link}`,
                    title: gameTitle,
                    platform: gamePlatform,
                    score: finalScore,
                });
            }
        });

        candidates.sort((a, b) => b.score - a.score);

        if (candidates.length === 0) {
            return NextResponse.json({ error: "Game not found", manual: true });
        }

        const bestMatch = candidates[0];
        const gameLink = bestMatch.link;

        await delay(500 + Math.random() * 300);

        const { data: gameData } = await axios.get(gameLink, {
            httpsAgent: agent,
            timeout: 8000,
            headers: {
                "User-Agent": getRandomAgent(),
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                Referer: searchUrl,
            },
        });

        const $ = cheerio.load(gameData);

        // ✅ Sacar los 4 precios correctos desde "Full Price Guide"
        const { marketLoose, marketItemBox, marketComplete, marketNew } = extractFullPriceGuide($);

        // Si por alguna razón la sección no está, devolvemos debug rápido
        if (!marketLoose || !marketItemBox || !marketComplete || !marketNew) {
            return NextResponse.json({
                error: "Could not read Full Price Guide prices",
                manual: true,
                debug: { marketLoose, marketItemBox, marketComplete, marketNew, gameLink },
            });
        }

        // 50% obligatorio
        const MARGIN = 0.5;

        const finalPrices = {
            loose: Math.round(marketLoose * MARGIN),           // Loose Price
            complete: Math.round(marketItemBox * MARGIN),      // Item & Box (Juego + caja)
            cib: Math.round(marketComplete * MARGIN),          // Complete Price (CIB)
            new: Math.round(marketNew * MARGIN),               // New Price (Sellado)
            matchedTitle: bestMatch.title,
            matchedPlatform: bestMatch.platform,
            confidence: bestMatch.score,
            lastUpdated: new Date().toISOString(),
        };

        return NextResponse.json(finalPrices, {
            status: 200,
            headers: {
                // s-maxage=604800: Cache en el servidor (Netlify CDN) por 7 días
                // stale-while-revalidate: Sirve el precio viejo mientras busca el nuevo en segundo plano
                "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
            },
        });
    } catch (error: any) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');

        return NextResponse.json(
            {
                error: isTimeout ? "El servidor de precios está tardando demasiado. Intenta nuevamente." : "Scraping failed",
                manual: true,
                details: error?.message || String(error)
            },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
