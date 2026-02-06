"use client";

export default function RetroOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Moving Scanline */}
            <div className="absolute inset-0 w-full h-[100px] bg-white/5 opacity-20 blur-xl animate-scanline" />

            {/* Persistent Scanlines */}
            <div className="absolute inset-0 w-full h-full opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Vignette */}
            <div className="absolute inset-0 w-full h-full shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>
    );
}
