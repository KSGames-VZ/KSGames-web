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

function normalizeText(s: string): string {
    return (s || "")
        .toLowerCase()
        .replace(/[:\-–—]/g, " ")
        .replace(/[_/\\|()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/['"]/g, "")
        .trim();
}

function slugify(s: string): string {
    return normalizeText(s).replace(/\s+/g, "-");
}

function calculateSimilarity(str1: string, str2: string): number {
    const n1 = normalizeText(str1);
    const n2 = normalizeText(str2);
    if (!n1 || !n2) return 0;
    if (n1 === n2) return 1.0;

    const w1 = n1.split(" ");
    const w2 = n2.split(" ");
    const common = w1.filter((w) => w2.includes(w)).length;
    const total = Math.max(w1.length, w2.length);
    return common / total;
}

/**
 * Key estándar interna:
 * nes, super-nintendo, nintendo-64, gamecube, wii, wii-u,
 * gameboy, game-boy-advance, nintendo-ds, nintendo-3ds,
 * playstation, playstation-2
 */
function normalizePlatform(input: string): string {
    const s = slugify(input);

    const direct: Record<string, string> = {
        nes: "nes",
        snes: "super-nintendo",
        "super-nintendo": "super-nintendo",
        n64: "nintendo-64",
        "nintendo-64": "nintendo-64",
        gamecube: "gamecube",
        gc: "gamecube",
        ngc: "gamecube",
        wii: "wii",
        "wii-u": "wii-u",
        wiiu: "wii-u",
        gameboy: "gameboy",
        gb: "gameboy",
        gba: "game-boy-advance",
        "game-boy-advance": "game-boy-advance",
        ds: "nintendo-ds",
        nds: "nintendo-ds",
        "nintendo-ds": "nintendo-ds",
        "3ds": "nintendo-3ds",
        "nintendo-3ds": "nintendo-3ds",
        ps1: "playstation",
        psx: "playstation",
        psone: "playstation",
        playstation: "playstation",
        ps2: "playstation-2",
        "playstation-2": "playstation-2",
        playstation2: "playstation-2",
    };

    if (direct[s]) return direct[s];

    const aliasGroups: Record<string, string[]> = {
        nes: ["nintendo-entertainment-system", "nintendo-nes", "famicom"],
        "super-nintendo": [
            "super-nintendo-entertainment-system",
            "super-nes",
            "supernintendo",
            "super-nintendo-system",
            "super-nintendo-entertainment",
            "super-nintendo",
            "snes",
        ],
        "nintendo-64": ["nintendo64", "nintendo-64", "n64"],
        gamecube: ["nintendo-gamecube", "game-cube", "gamecube", "ngc", "gc"],
        wii: ["nintendo-wii", "wii"],
        "wii-u": ["nintendo-wii-u", "wii-u", "wiiu"],
        gameboy: ["game-boy", "gameboy", "nintendo-game-boy", "gb"],
        "game-boy-advance": ["gameboy-advance", "game-boy-advance", "game-boy-adv", "gba", "gameboyadvance"],
        "nintendo-ds": ["ds", "nintendo-ds", "nintendo-ds-lite", "nds"],
        "nintendo-3ds": ["3ds", "nintendo-3ds", "new-nintendo-3ds"],
        playstation: ["ps1", "psx", "psone", "playstation-1", "sony-playstation", "playstation"],
        "playstation-2": ["ps2", "playstation-2", "sony-ps2", "playstation2"],
    };

    for (const [standard, aliases] of Object.entries(aliasGroups)) {
        if (aliases.some((a) => s === a || s.includes(a) || a.includes(s))) return standard;
    }

    return s;
}

function parseMoney(text: string): number {
    const cleaned = (text || "").replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Full Price Guide: Loose, Item & Box, Complete, New
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
    const title = searchParams.get("title") || "";
    const platformRaw = searchParams.get("platform") || "";

    if (!title) return NextResponse.json({ error: "No title" }, { status: 400 });

    const normalizedSearchPlatform = normalizePlatform(platformRaw);

    try {
        await delay(200 + Math.random() * 250);

        // TU LÓGICA: buscar SOLO por el título
        const searchUrl = `https://www.pricecharting.com/search-products?type=prices&q=${encodeURIComponent(
            title
        )}`;

        // --- STEP 1: Search ---
        let search = await fetchHtml(searchUrl);

        if ((search.status === 403 || search.status === 429 || looksBlocked(search.html)) && search.html) {
            await delay(800 + Math.random() * 400);
            search = await fetchHtml(searchUrl);
        }

        if (search.status !== 200 || !search.html) {
            return NextResponse.json(
                { error: "Search request failed", manual: true, debug: { status: search.status, searchUrl } },
                { status: 200 }
            );
        }

        if (looksBlocked(search.html)) {
            return NextResponse.json(
                { error: "Blocked on search (anti-bot)", manual: true, debug: { status: search.status, preview: search.html.slice(0, 500) } },
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
        const rows = $search("#games_table tbody tr");

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Search results table not found", manual: true, debug: { searchUrl, preview: search.html.slice(0, 700) } },
                { status: 200 }
            );
        }

        rows.each((_, row) => {
            const $row = $search(row);

            const titleCell = $row.find("td").eq(1);
            const platformCell = $row.find("td").eq(2);

            const gameTitle = titleCell.find("a").text().trim() || titleCell.text().trim();
            const gamePlatformText = platformCell.text().replace(/\s+/g, " ").trim().toLowerCase();
            const link = titleCell.find("a").attr("href") || "";

            if (!link || !gameTitle) return;

            const titleScore = calculateSimilarity(title, gameTitle);

            // TU LÓGICA: platform match estricto contra tu normalización
            const platformMatches = normalizePlatform(gamePlatformText) === normalizedSearchPlatform;

            // TU LÓGICA: bonus 0.3 si plataforma matchea
            const finalScore = titleScore + (platformMatches ? 0.3 : 0);

            // TU LÓGICA: umbrales originales
            if ((titleScore >= 0.5 && platformMatches) || titleScore >= 0.85) {
                candidates.push({
                    link: link.startsWith("http") ? link : `https://www.pricecharting.com${link}`,
                    title: gameTitle,
                    platform: gamePlatformText,
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
                { error: "Game page request failed", manual: true, debug: { status: game.status, gameLink } },
                { status: 200 }
            );
        }

        if (looksBlocked(game.html)) {
            return NextResponse.json(
                { error: "Blocked on game page (anti-bot)", manual: true, debug: { status: game.status, gameLink, preview: game.html.slice(0, 500) } },
                { status: 200 }
            );
        }

        const $ = cheerio.load(game.html);
        const { marketLoose, marketItemBox, marketComplete, marketNew } = extractFullPriceGuide($);

        if (!marketLoose || !marketItemBox || !marketComplete || !marketNew) {
            return NextResponse.json(
                {
                    error: "Could not read Full Price Guide prices",
                    manual: true,
                    debug: {
                        gameLink,
                        marketLoose,
                        marketItemBox,
                        marketComplete,
                        marketNew,
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

        // Mapping EXACTO a tus botones:
        // 1) Loose
        // 2) Item & Box
        // 3) Complete (CIB)
        // 4) New
        const finalPrices = {
            loose: Math.round(marketLoose * MARGIN),
            itemBox: Math.round(marketItemBox * MARGIN),
            cib: Math.round(marketComplete * MARGIN),
            new: Math.round(marketNew * MARGIN),
            matchedTitle: bestMatch.title,
            matchedPlatform: bestMatch.platform,
            confidence: bestMatch.score,
            lastUpdated: new Date().toISOString(),
        };

        return NextResponse.json(finalPrices, {
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
                "Surrogate-Control": "no-store",
            },
        });
    } catch (error: any) {
        const isTimeout =
            error?.code === "ECONNABORTED" || String(error?.message || "").toLowerCase().includes("timeout");

        return NextResponse.json(
            {
                error: isTimeout ? "Timeout consultando PriceCharting." : "Scraping failed",
                manual: true,
                details: error?.message || String(error),
            },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
