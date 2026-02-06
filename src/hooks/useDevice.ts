"use client";

import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "desktop";

export function useDevice() {
    const [device, setDevice] = useState<DeviceType>("desktop");

    useEffect(() => {
        const checkDevice = () => {
            // Typically mobile is < 768px (MD breakpoint in Tailwind)
            if (window.innerWidth < 768) {
                setDevice("mobile");
            } else {
                setDevice("desktop");
            }
        };

        // Initial check
        checkDevice();

        // Add listener for window resize
        window.addEventListener("resize", checkDevice);

        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    return {
        device,
        isMobile: device === "mobile",
        isDesktop: device === "desktop",
    };
}
