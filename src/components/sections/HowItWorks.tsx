import { Search, DollarSign, Package } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: "1. Busca",
            desc: "Encuentra tu juego en nuestro catálogo inteligente conectado a la base de datos global de IGDB.",
        },
        {
            icon: DollarSign,
            title: "2. Cotiza",
            desc: "Selecciona el estado de tu juego (Loose, CIB, Nuevo) y recibe un precio estimado al instante.",
        },
        {
            icon: Package,
            title: "3. Envía",
            desc: "Confirma tu venta por WhatsApp, envía tus juegos y recibe tu pago rápido y seguro.",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 relative overflow-hidden">
            {/* Decorative lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Vender es <span className="text-purple-400">fácil y rápido</span>
                    </h2>
                    <p className="text-slate-400">Tres simples pasos para convertir tu colección en efectivo</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-amber-500/40 to-slate-800 -z-10" />

                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative group text-center">
                                <div className="w-20 h-20 mx-auto bg-slate-900 rounded-xl border-2 border-slate-700 flex items-center justify-center mb-6 shadow-xl group-hover:border-amber-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all z-10 relative">
                                    <Icon className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed px-4">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
