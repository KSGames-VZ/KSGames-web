import { Gamepad2, Laptop, Tv } from "lucide-react";

const CONSOLES = [
    { id: 18, name: "NES", icon: Tv, image: "/assets/consoles/nes.png" },
    { id: 19, name: "SNES", icon: Gamepad2, image: "/assets/consoles/snes.png" },
    { id: 4, name: "N64", icon: Gamepad2, image: "/assets/consoles/n64.png" },
    { id: 21, name: "GameCube", icon: Tv, image: "/assets/consoles/gamecube.png" },
    { id: 5, name: "Wii", icon: Gamepad2, image: "/assets/consoles/wii.png" },
    { id: 41, name: "Wii U", icon: Gamepad2, image: "/assets/consoles/wiiu.png" },
    { id: 33, name: "GameBoy", icon: Laptop, image: "/assets/consoles/gameboy.png" },
    { id: 24, name: "GBA", icon: Laptop, image: "/assets/consoles/gba.png" },
    { id: 20, name: "DS", icon: Laptop, image: "/assets/consoles/ds.png" },
    { id: 137, name: "3DS", icon: Laptop, image: "/assets/consoles/3ds.png" },
    { id: 7, name: "PS1", icon: Tv, image: "/assets/consoles/ps1.png" },
    { id: 8, name: "PS2", icon: Tv, image: "/assets/consoles/ps2.png" },
    { id: 9, name: "PS3", icon: Tv, image: "/assets/consoles/ps3.png" },
];

interface ConsoleSelectorProps {
    selectedConsole: number | null;
    onSelect: (id: number) => void;
}

export default function ConsoleSelector({ selectedConsole, onSelect }: ConsoleSelectorProps) {
    return (
        <div className="w-full relative group">
            {/* Mobile Fade Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10 md:hidden" />

            <div className="w-full overflow-x-auto py-6 no-scrollbar snap-x snap-mandatory px-4">
                <div className="flex gap-4 min-w-max">
                    {CONSOLES.map((console) => {
                        const Icon = console.icon;
                        const isSelected = selectedConsole === console.id;

                        return (
                            <button
                                key={console.id}
                                onClick={() => onSelect(console.id)}
                                className={`
                  snap-center flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
                  ${isSelected
                                        ? "bg-yellow-500/20 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110 z-10"
                                        : "bg-slate-800/50 border-slate-700 hover:border-yellow-400 hover:bg-slate-800 hover:-translate-y-1"
                                    }
                `}
                            >
                                <div className="relative w-12 h-8 mb-2 flex items-center justify-center">
                                    <img
                                        src={console.image}
                                        alt={console.name}
                                        className={`w-full h-full object-contain drop-shadow-md transition-all duration-300 ${isSelected ? "brightness-125 scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <Icon className="w-8 h-8 hidden text-slate-500" />
                                </div>

                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-green-300" : "text-slate-400 group-hover:text-white"}`}>
                                    {console.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
