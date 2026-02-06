export default function Hero() {
    return (
        <section id="hero" className="relative pt-40 pb-24 md:pt-52 md:pb-40 overflow-hidden bg-transparent">
            {/* Background Effects (Subtle green blur only) */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-green-500/5 blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
                    KSGames: Expertos en <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-500 animate-ks-glow">
                        Videojuegos Clásicos y Modernos
                    </span>
                </h1>

                {/* Decorative Floating Elements (Visible on Mobile with responsive sizes/positions) */}
                <div className="absolute left-[2%] top-[25%] lg:left-[5%] lg:top-[50%] animate-float select-none pointer-events-none opacity-80">
                    <img src="/assets/mario.png" alt="Mario" className="w-12 md:w-24 pixelated drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    <span className="block text-center text-[10px] lg:text-xs font-bold text-rose-500 mt-2 font-mono">+1 LIFE</span>
                </div>
                <div className="absolute right-[2%] bottom-[10%] lg:right-[5%] lg:bottom-[15%] animate-float select-none pointer-events-none opacity-80" style={{ animationDelay: '1.5s' }}>
                    <img src="/assets/zelda.png" alt="Link" className="w-12 md:w-24 pixelated drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                    <span className="block text-center text-[10px] lg:text-xs font-bold text-cyan-400 mt-2 font-mono">IT'S DANGEROUS!</span>
                </div>

                <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed relative z-10">
                    Compramos y vendemos con la seguridad que solo <span className="text-yellow-400 font-bold">nuestra trayectoria</span> puede darte.
                    Desde <strong className="text-white">Caracas</strong> para toda <strong className="text-white">Venezuela</strong>.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <a
                        href="#catalog"
                        className="w-full md:w-auto px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-lg transition-all shadow-[0_0_25px_rgba(250,204,21,0.3)] hover:scale-105 uppercase tracking-wide"
                    >
                        Ver Catálogo
                    </a>
                </div>
            </div>
        </section>
    );
}
