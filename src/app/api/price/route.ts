import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
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
    const cleaned = platform.toLowerCase().replace(/\s+/g, "-").replace(/\n/g, "-").trim();


    const map: Record<string, string[]> = {
        "playstation": ["ps1", "psx", "playstation", "playstation-1"],
        "playstation-2": ["ps2", "playstation-2"],
        "playstation-3": ["ps3", "playstation-3"],
        "nintendo-64": ["n64", "nintendo-64", "nintendo64"],
        "gamecube": ["gc", "gamecube", "game-cube", "ngc"],
        "super-nintendo": ["snes", "super-nintendo", "super-nes"],
        "nes": ["nes", "nintendo-entertainment-system"],
        "game-boy": ["gb", "gameboy", "game-boy"],
        "gameboy-advance": ["gba", "game-boy-advance", "gameboy-advance"],
        "nintendo-ds": ["ds", "nintendo-ds", "nds"],
        "nintendo-3ds": ["3ds", "nintendo-3ds"],
        "wii": ["wii", "nintendo-wii"],
        "wii-u": ["wiiu", "wii-u", "nintendo-wii-u"],
        "xbox": ["xbox", "microsoft-xbox"],
    };


    for (const [standard, aliases] of Object.entries(map)) {
        if (aliases.some((alias) => cleaned.includes(alias) || alias.includes(cleaned))) return standard;
    }
    return cleaned;
}


function parseMoney(text: string): number {
    const cleaned = (text || "").replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
}


/**
 * Extrae los 4 precios de "Full Price Guide" (tabla clave/valor):
 * Loose, Item & Box, Complete, New
 */
function extractFullPriceGuide($: cheerio.CheerioAPI) {
    const out: Record<string, number> = {};


    $("tr").each((_, tr) => {
        const cells = $(tr).find("th,td");
        if (cells.length !== 2) return;


        const key = $(cells[0]).text().replace(/\s+/g, " ").trim();
        const val = $(cells[1]).text().replace(/\s+/g, " ").trim();


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


function looksBlocked(html: string) {
    const s = (html || "").toLowerCase();
    return (
        s.includes("captcha") ||
        s.includes("cloudflare") ||
        s.includes("access denied") ||
        s.includes("unusual traffic") ||
        s.includes("verify you are human") ||
        s.includes("attention required")
    );
}


async function fetchHtml(url: string, referer?: string) {
    const headers: Record<string, string> = {
        "User-Agent": getRandomAgent(),
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        // IMPORTANTÍSIMO: evita brotli (br) para no tener HTML "raro" en serverless
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Connection: "close",
    };
    if (referer) headers.Referer = referer;


    const resp = await axios.get(url, {
        timeout: 15000,
        headers,
        maxRedirects: 5,
        validateStatus: () => true,
    });


    const data = typeof resp.data === "string" ? resp.data : "";
    return {
        status: resp.status,
        contentType: resp.headers?.["content-type"] || "",
        html: data,
    };
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const platform = searchParams.get("platform")?.toLowerCase() || "";


    if (!title) return NextResponse.json({ error: "No title" }, { status: 400 });


    try {
        await delay(200 + Math.random() * 250);


        const searchUrl = `https://www.pricecharting.com/search-products?type=prices&q=${encodeURIComponent(
            title
        )}`;


        // --- STEP 1: Search page ---
        let search = await fetchHtml(searchUrl);


        // Reintento simple si huele a bloqueo / rate limit
        if ((search.status === 403 || search.status === 429 || looksBlocked(search.html)) && search.html) {
            await delay(800 + Math.random() * 400);
            search = await fetchHtml(searchUrl);
        }


        if (search.status !== 200 || !search.html) {
            return NextResponse.json(
                {
                    error: "Search request failed",
                    manual: true,
                    debug: { status: search.status, contentType: search.contentType, searchUrl },
                },
                { status: 200 }
            );
        }


        if (looksBlocked(search.html)) {
            return NextResponse.json(
                {
                    error: "Blocked on search (anti-bot)",
                    manual: true,
                    debug: { status: search.status, searchUrl, preview: search.html.slice(0, 500) },
                },
                { status: 200 }
            );
        }


        const $search = cheerio.load(search.html);


        interface Candidate {
            link: string;
            title: string;
            platform: string;
            score: number;
        }


        const candidates: Candidate[] = [];
        const normalizedSearchPlatform = normalizePlatform(platform);


        const rows = $search("#games_table tbody tr");


        // Si esto viene vacío en Netlify: bloqueo o HTML diferente
        if (rows.length === 0) {
            return NextResponse.json(
                {
                    error: "Search results table not found (possible block or HTML change)",
                    manual: true,
                    debug: { searchUrl, preview: search.html.slice(0, 700) },
                },
                { status: 200 }
            );
        }


        rows.each((_, row) => {
            const $row = $search(row);


            const titleCell = $row.find("td").eq(1);
            const platformCell = $row.find("td").eq(2);


            const gameTitle = titleCell.find("a").text().trim() || titleCell.text().trim();
            const gamePlatform = platformCell.text().replace(/\s+/g, " ").trim().toLowerCase();
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
            return NextResponse.json({ error: "Game not found", manual: true }, { status: 200 });
        }


        const bestMatch = candidates[0];
        const gameLink = bestMatch.link;


        await delay(250 + Math.random() * 350);


        // --- STEP 2: Game page ---
        let game = await fetchHtml(gameLink, searchUrl);


        if ((game.status === 403 || game.status === 429 || looksBlocked(game.html)) && game.html) {
            await delay(800 + Math.random() * 400);
            game = await fetchHtml(gameLink, searchUrl);
        }


        if (game.status !== 200 || !game.html) {
            return NextResponse.json(
                {
                    error: "Game page request failed",
                    manual: true,
                    debug: { status: game.status, contentType: game.contentType, gameLink },
                },
                { status: 200 }
            );
        }


        if (looksBlocked(game.html)) {
            return NextResponse.json(
                {
                    error: "Blocked on game page (anti-bot)",
                    manual: true,
                    debug: { status: game.status, gameLink, preview: game.html.slice(0, 500) },
                },
                { status: 200 }
            );
        }


        const $ = cheerio.load(game.html);


        const { marketLoose, marketItemBox, marketComplete, marketNew } = extractFullPriceGuide($);


        if (!marketLoose || !marketItemBox || !marketComplete || !marketNew) {
            return NextResponse.json(
                {
                    error: "Could not read Full Price Guide prices (HTML changed or partial load)",
                    manual: true,
                    debug: {
                        gameLink,
                        marketLoose,
                        marketItemBox,
                        marketComplete,
                        marketNew,
                        // Ayuda para ver si el texto existe
                        hasLoose: game.html.includes("Loose"),
                        hasItemBox: game.html.includes("Item & Box"),
                        hasComplete: game.html.includes("Complete"),
                        hasNew: game.html.includes("New"),
                        preview: game.html.slice(0, 700),
                    },
                },
                { status: 200 }
            );
        }


        // 50% obligatorio
        const MARGIN = 0.5;


        const finalPrices = {
            loose: Math.round(marketLoose * MARGIN),           // Loose Price
            complete: Math.round(marketItemBox * MARGIN),      // Item & Box
            cib: Math.round(marketComplete * MARGIN),          // CIB
            new: Math.round(marketNew * MARGIN),               // New
            matchedTitle: bestMatch.title,
            matchedPlatform: bestMatch.platform,
            confidence: bestMatch.score,
            lastUpdated: new Date().toISOString(),
        };


        return NextResponse.json(finalPrices, {
            status: 200,
            headers: {
                // Éstos headers obligan a Netlify a NO guardar cache y buscar precios nuevos siempre
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Surrogate-Control": "no-store"
            }
        });
    } catch (error: any) {
        const isTimeout = error?.code === "ECONNABORTED" || String(error?.message || "").includes("timeout");
        return NextResponse.json(
            {
                error: isTimeout
                    ? "Timeout consultando PriceCharting (posible bloqueo o latencia)."
                    : "Scraping failed",
                manual: true,
                details: error?.message || String(error),
            },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
