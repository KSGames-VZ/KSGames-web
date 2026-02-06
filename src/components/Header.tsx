import { Gamepad2 } from "lucide-react";

const navLinks = [
    { name: "Inicio", href: "/#hero" },
    { name: "Catálogo", href: "/#catalog" },
    { name: "Sobre Nosotros", href: "/#about" },
    { name: "Contactar", href: "https://wa.me/584242580291", external: true },
];

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

                {/* Official Branding Logo */}
                <a href="/" className="flex items-center gap-3 group cursor-pointer h-full py-2">
                    <img
                        src="/assets/logo.png"
                        alt="KSGames Logo"
                        className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white tracking-tighter leading-none group-hover:animate-ks-glitch transition-all">
                            KSGAMES
                        </span>
                        <span className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase ml-0.5">Gaming World</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="text-sm font-bold text-slate-400 hover:text-yellow-400 transition-colors uppercase tracking-wider relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Icon (Placeholder for functionality) */}
                <button className="md:hidden text-white">
                    <div className="w-6 h-0.5 bg-white mb-1.5 rounded-full"></div>
                    <div className="w-6 h-0.5 bg-yellow-400 mb-1.5 rounded-full"></div>
                    <div className="w-6 h-0.5 bg-white rounded-full"></div>
                </button>
            </div>
        </header>
    );
}
