"use client";

import { useEffect, useRef } from "react";
import { useDevice } from "@/hooks/useDevice";

export default function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isMobile } = useDevice();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: {
            x: number;
            y: number;
            size: number;
            speedY: number;
            color: string;
            alpha: number;
        }[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        };

        const createParticles = () => {
            particles = [];
            const density = isMobile ? 25 : 8;
            const particleCount = Math.floor(window.innerWidth / density);

            for (let i = 0; i < particleCount; i++) {
                const colorRand = Math.random();
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * (isMobile ? 1.5 : 3) + 0.5,
                    speedY: Math.random() * (isMobile ? 0.8 : 1.5) + 0.1,
                    alpha: Math.random() * 0.4 + 0.1,
                    // Official Logo Palette: Yellow, Cyan, Pink
                    color: colorRand > 0.6 ? "#facc15" : colorRand > 0.3 ? "#06b6d4" : "#f43f5e",
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.y += p.speedY;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;

                ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobile]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
