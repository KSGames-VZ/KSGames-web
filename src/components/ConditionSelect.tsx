"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Info } from "lucide-react";

export type Condition = "Loose" | "Boxed" | "CIB" | "New";

interface ConditionSelectProps {
    isOpen: boolean;
    onClose: () => void;
    game: any;
    platformSlug: string;
    onConfirm: (condition: Condition, price: number) => void;
}

interface PriceData {
    loose: number;
    complete: number;
    cib: number;
    new: number;
    manual?: boolean;
}

export default function ConditionSelect({ isOpen, onClose, game, platformSlug, onConfirm }: ConditionSelectProps) {
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState<PriceData | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isOpen && game && platformSlug) {
            fetchPrices();
        } else {
            setPrices(null);
            setError(false);
        }
    }, [isOpen, game, platformSlug]);

    const fetchPrices = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`/api/price?title=${encodeURIComponent(game.name)}&platform=${platformSlug}`);
            const data = await res.json();
            if (data.error) {
                setError(true);
            } else {
                setPrices(data);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !game) return null;

    // BUY OFFER MARGIN (50%)
    const MARGIN = 0.5;

    const conditions: { label: string; value: Condition; desc: string; key: keyof PriceData }[] = [
        { label: "Suelto (Solo Disco/Cartucho)", value: "Loose", desc: "Sin caja ni manuales", key: "loose" },
        { label: "Con Caja (Boxed)", value: "Boxed", desc: "Solo caja y juego", key: "complete" },
        { label: "Completo (CIB)", value: "CIB", desc: "Caja, manual y juego", key: "cib" },
        { label: "Nuevo / Sellado", value: "New", desc: "Nunca abierto, empaque original", key: "new" },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-lg bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative animate-fade-in-up">

                {/* Header with Title */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Estado del Juego</h2>
                        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest mt-1">Oferta de Compra Instantánea</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {/* Game Preview */}
                    <div className="flex gap-6 mb-8 bg-white/5 p-5 rounded-3xl border border-white/5 items-center">
                        <div className="relative w-24 h-32 flex-shrink-0">
                            <img
                                src={game.cover?.url?.replace("t_thumb", "t_cover_big")}
                                width={96}
                                height={128}
                                className="w-full h-full object-cover rounded-xl shadow-2xl bg-slate-900 animate-pulse-once"
                                alt={game.name}
                                onLoad={(e) => (e.currentTarget.className = "w-full h-full object-cover rounded-xl shadow-2xl bg-transparent")}
                            />
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-black leading-tight tracking-tighter uppercase">{game.name}</h3>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase font-black tracking-widest mt-2 inline-block border border-yellow-500/20">
                                {platformSlug.replace(/-/g, " ")}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tasando valor de mercado...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {conditions.map((c) => {
                                // Now prices are pre-calculated 50% offers from the API
                                const offerPrice = prices ? Number(prices[c.key]) : 0;
                                const isAvailable = offerPrice > 0;

                                return (
                                    <button
                                        key={c.value}
                                        disabled={!isAvailable && !error}
                                        onClick={() => onConfirm(c.value, offerPrice)}
                                        className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all group relative overflow-hidden ${isAvailable
                                            ? "bg-white/5 border-white/5 hover:border-yellow-400/50 hover:bg-white/10"
                                            : "opacity-40 bg-slate-900 border-transparent cursor-not-allowed"
                                            }`}
                                    >
                                        <div className="text-left relative z-10">
                                            <div className="font-black text-white group-hover:text-yellow-400 transition-colors uppercase text-sm tracking-tight">
                                                {c.label}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{c.desc}</div>
                                        </div>
                                        <div className="text-right relative z-10">
                                            {isAvailable ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter">${offerPrice}</span>
                                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Oferta KS</span>
                                                </div>
                                            ) : (
                                                <span className="text-[8px] text-slate-500 font-bold uppercase text-right leading-tight block max-w-[100px]">
                                                    Cotización sujeta a revisión física en Caracas
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Manual Review Note */}
                    {(error || (prices && prices.manual)) && (
                        <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
                            <Info className="w-5 h-5 text-rose-500 shrink-0" />
                            <p className="text-xs text-rose-200 leading-normal">
                                <strong className="block uppercase tracking-widest mb-1 text-rose-500">Nota:</strong>
                                No pudimos tasar este juego automáticamente. Agrégalo para solicitar una <strong className="text-white">revisión manual</strong> vía WhatsApp.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="bg-white/5 p-4 text-center">
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">
                        Cotización sujeta a valoración física • Consulta condiciones finales vía WhatsApp
                    </p>
                </div>
            </div>
        </div>
    );
}
