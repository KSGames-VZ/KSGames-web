import { useState } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { Send, Info, Camera } from "lucide-react";

interface CheckoutFormProps {
    cartItems: any[];
}

export default function CheckoutForm({ cartItems }: CheckoutFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            alert("Por favor completa tus datos");
            return;
        }
        const link = generateWhatsAppLink(cartItems, { name, phone }, []);
        window.open(link, "_blank");
    };

    if (cartItems.length === 0) return null;

    return (
        <div className="p-8 bg-black/60 backdrop-blur-md rounded-3xl border border-white/10 mt-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <div className="bg-yellow-500/20 p-2 rounded-xl">
                    <Send className="w-6 h-6 text-yellow-500" />
                </div>
                Finalizar Cotización
            </h3>

            {/* Aviso de Fotos (Cartel) */}
            <div className="mb-8 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4 items-start">
                <div className="bg-blue-500/20 p-2 rounded-lg shrink-0">
                    <Camera className="w-5 h-5 text-blue-400" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider">Paso Importante</h4>
                    <p className="text-slate-300 text-sm leading-tight">
                        Al hacer clic en el botón de abajo, se abrirá un chat de WhatsApp con tu lista.
                        <strong> Por favor, adjunta fotos de tus juegos allí</strong> para que podamos darte la valoración final física.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Tu Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: Mario Bros"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Tu WhatsApp</label>
                        <input
                            type="tel"
                            placeholder="Ej: 0412..."
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 py-6 rounded-2xl font-black text-xl shadow-xl shadow-yellow-500/10 transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-tighter group flex items-center justify-center gap-3"
                    >
                        ENVIAR LISTA POR WHATSAPP
                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>

                    <div className="mt-6 flex justify-center items-center gap-2 text-slate-600">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Respuesta rápida garantizada</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
