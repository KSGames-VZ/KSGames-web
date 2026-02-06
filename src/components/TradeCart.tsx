import { Trash2, X, ChevronRight, ShoppingBag } from "lucide-react";

interface TradeCartProps {
    items: any[];
    onRemove: (index: number) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onCheckout?: () => void;
}

export default function TradeCart({ items, onRemove, isOpen, setIsOpen, onCheckout }: TradeCartProps) {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col relative">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-500/20 p-2 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-yellow-500" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">MI LISTA</h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
                                <ShoppingBag className="w-16 h-16" />
                                <p className="text-lg font-medium">Tu lista está vacía.</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-green-400 text-sm font-bold uppercase tracking-widest hover:underline"
                                >
                                    Empezar a buscar
                                </button>
                            </div>
                        ) : (
                            items.map((item, idx) => (
                                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 relative group hover:border-white/10 transition-all">
                                    <div className="w-20 h-24 bg-black rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                                        {item.cover ? (
                                            <img src={item.cover} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">?</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white leading-tight truncate">{item.name}</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{item.platform}</span>
                                            <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{item.condition}</span>
                                        </div>
                                        <p className="text-xl font-black text-yellow-400 mt-2 font-mono">${item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemove(idx)}
                                        className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-black/90 backdrop-blur-md border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Estimado</span>
                            <span className="text-4xl font-black text-yellow-400 font-mono tracking-tighter">${total}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={onCheckout}
                                disabled={items.length === 0}
                                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2 uppercase tracking-wide group"
                            >
                                Ir a cerrar venta
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 uppercase tracking-wide"
                            >
                                Seguir seleccionando
                            </button>
                        </div>

                        <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest pt-2">
                            KSGAMES • SEGURIDAD Y CONFIANZA
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
