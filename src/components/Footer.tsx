import { Facebook, Instagram, Twitter, Gamepad2 } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="bg-black pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12 mb-16">

                    {/* Brand & Location */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                                <Gamepad2 className="w-6 h-6 text-yellow-400" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase group-hover:animate-ks-glitch transition-all">
                                KSGAMES
                            </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            Caracas, Venezuela. <br />
                            Expertos en envíos nacionales garantizados.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs border-b border-yellow-500/30 inline-block pb-1">Enlaces</h4>
                        <ul className="space-y-3">
                            <li><a href="/policy/privacy" className="text-slate-500 hover:text-yellow-400 transition-colors font-bold text-sm uppercase">Privacidad</a></li>
                            <li><a href="/policy/terms" className="text-slate-500 hover:text-yellow-400 transition-colors font-bold text-sm uppercase">Términos</a></li>
                            <li><a href="https://wa.me/584242580291" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-yellow-400 transition-colors font-bold text-sm uppercase">Soporte técnico</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs border-b border-pink-500/30 inline-block pb-2">Redes Sociales</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/ksgames.vnzla" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500 border border-white/10 transition-all group">
                                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        Copyright © 2026 KSGames • Caracas, Venezuela
                    </p>
                </div>
            </div>
        </footer>
    );
}
