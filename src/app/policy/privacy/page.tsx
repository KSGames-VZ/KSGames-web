"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, Scale } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-green-500/30">
            <Header />
            <main className="pt-32 pb-24 container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                        Política de Privacidad
                    </h1>
                    <p className="text-slate-400">Última actualización: Febrero 2026</p>
                </div>

                <div className="space-y-12">
                    <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <Lock className="w-6 h-6 text-green-400" />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Compromiso de Seguridad</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            En **KSGAMES**, valoramos la confianza que depositas en nosotros al decidir vender tus videojuegos. Esta política detalla cómo manejamos tu información personal con el más alto estándar de seguridad y transparencia.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-slate-800 p-6 rounded-2xl bg-slate-900/20">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-green-400 text-sm">1</span>
                                Datos Recolectados
                            </h3>
                            <ul className="text-slate-400 space-y-2 text-sm leading-relaxed">
                                <li>• Nombre completo para identificación de venta.</li>
                                <li>• Número de teléfono / WhatsApp para contacto directo.</li>
                                <li>• Fotografías de los productos para valoración técnica.</li>
                                <li>• Datos de pago (Solo para procesar tu ganancia).</li>
                            </ul>
                        </div>

                        <div className="border border-slate-800 p-6 rounded-2xl bg-slate-900/20">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 text-sm">2</span>
                                Uso de la Información
                            </h3>
                            <ul className="text-slate-400 space-y-2 text-sm leading-relaxed">
                                <li>• Gestión de cotizaciones en tiempo real.</li>
                                <li>• Validación de autenticidad de los artículos.</li>
                                <li>• Coordinación de logística de envío en Venezuela.</li>
                                <li>• Prevención de fraude y cumplimiento legal.</li>
                            </ul>
                        </div>
                    </div>

                    <section className="border-l-4 border-green-500 pl-8 py-4">
                        <div className="flex items-center gap-4 mb-4">
                            <EyeOff className="w-6 h-6 text-slate-400" />
                            <h2 className="text-2xl font-bold text-white">Cero Spam y Cero Reventa de Datos</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed italic">
                            KSGAMES nunca venderá, alquilará o compartirá tus datos personales con terceros para fines publicitarios. Toda información es estrictamente para la transacción comercial entre tú y nuestra tienda oficial.
                        </p>
                    </section>

                    <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <Scale className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Tus Derechos</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Conforme a las leyes de protección de datos, tienes derecho a solicitar la eliminación íntegra de tu historial de ventas y datos de contacto de nuestro sistema en cualquier momento contactando a nuestro equipo de soporte.
                        </p>
                        <div className="flex justify-center">
                            <a href="#contact" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
                                Contactar DPO
                            </a>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
