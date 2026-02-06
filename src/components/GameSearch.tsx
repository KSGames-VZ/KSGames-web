import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface GameSearchProps {
    platformId: number | null;
    onSelectGame: (game: any) => void;
}

export default function GameSearch({ platformId, onSelectGame }: GameSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                setVisibleCount(12); // Reset pagination on new search
                try {
                    const res = await fetch("/api/igdb", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query, platformId }),
                    });
                    const data = await res.json();
                    setResults(Array.isArray(data) ? data : []);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query, platformId]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 12);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder={platformId ? "Busca tu juego... (ej: Zelda)" : "Selecciona una consola arriba primero..."}
                    disabled={!platformId}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin text-yellow-400" /> : <Search className="w-5 h-5" />}
                </div>
            </div>

            {results.length > 0 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {results.slice(0, visibleCount).map((game) => (
                            <button
                                key={game.id}
                                onClick={() => onSelectGame(game)}
                                className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-300 text-left"
                            >
                                <div className="aspect-[3/4] overflow-hidden bg-slate-900 relative">
                                    {game.cover?.url ? (
                                        <img
                                            src={game.cover.url.replace("t_thumb", "t_cover_big")}
                                            alt={game.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">No Cover</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                                </div>
                                <div className="p-3 absolute bottom-0 w-full">
                                    <h4 className="text-sm font-bold text-white leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2 shadow-black drop-shadow-md">
                                        {game.name}
                                    </h4>
                                    <p className="text-[10px] text-slate-300 mt-1">
                                        {new Date(game.first_release_date * 1000).getFullYear() || "Retro"}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {visibleCount < results.length && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-full transition-colors border border-slate-700"
                            >
                                Cargar más juegos ({results.length - visibleCount} restantes)
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
