import { MapPin, Truck, ShieldCheck } from "lucide-react";

export default function AboutUs() {
    return (
        <section id="about" className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                            Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400">Nosotros</span>
                        </h2>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                            Trayectoria y Confianza <br />
                            <span className="text-yellow-400">Desde Caracas para toda Venezuela</span>
                        </h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Ubicados en <strong className="text-white">Caracas, Venezuela</strong>, KSGames se ha consolidado como un referente de confianza en el mercado.
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Nuestra trayectoria nos avala como expertos en el intercambio de cultura gamer, ofreciendo productos de alta calidad y un servicio de primera.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 pt-8">
                            <div className="flex flex-col items-center gap-3 text-slate-300 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0 border border-yellow-500/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-tight text-center">Seguridad y garantía</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-slate-300 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/20">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-tight text-center">Envíos nacionales</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-slate-300 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/20">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-tight text-center">Ubicados en Caracas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
