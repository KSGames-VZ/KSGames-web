"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Gavel, CheckCircle2, AlertTriangle, PackageSearch } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-green-500/30">
            <Header />
            <main className="pt-32 pb-24 container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <Gavel className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                        Términos y Condiciones
                    </h1>
                    <p className="text-slate-400">KSGAMES Caracas - Al usar nuestro servicio, aceptas estos términos.</p>
                </div>

                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            1. SOBRE LA PROPIEDAD
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            El vendedor declara bajo juramento que los artículos ofrecidos para la compra son de su propiedad legítima y no proceden de actividades ilícitas. **KSGAMES** se reserva el derecho de reportar a las autoridades cualquier intento de venta de mercancía con reporte de robo.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                            <PackageSearch className="w-5 h-5 text-blue-400" />
                            2. VALORACIÓN Y ESTADO
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Toda cotización generada en la web es **ESTIMADA**. La oferta final se confirmará tras la inspección física del equipo.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono uppercase tracking-tighter text-slate-500">
                            <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">CIB: Caja + Manual + Juego</li>
                            <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">LOOSE: Solo el cartucho/disco</li>
                        </ul>
                    </div>

                    {/* Section 3 - Warning */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <h2 className="text-xl font-black text-red-400 mb-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            3. RESPONSABILIDAD DE ENVÍO
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Los envíos nacionales en Venezuela se realizan a riesgo del vendedor. Recomendamos usar servicios asegurados (MRW, Zoom, Tealca). KSGAMES no se hace responsable por daños o pérdidas ocurridos durante el trayecto antes de la recepción oficial en nuestro local central.
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-purple-400" />
                            4. PROCESO DE PAGO
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Una vez verificado el estado y autenticidad del videojuego, el pago se procesará en un máximo de **24 horas hábiles** mediante el método acordado (Pago Móvil, Transferencia o Divisas).
                        </p>
                    </div>

                    {/* Final Footer */}
                    <div className="pt-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] space-y-2">
                        <p>KSGAMES • J-12345678-9 • CARACAS VENEZUELA</p>
                        <p>DERECHOS RESERVADOS 2026</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
