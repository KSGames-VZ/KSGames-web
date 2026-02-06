"use client";

import { useState, useEffect } from "react";

export function useDevice() {
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const onChange = () => {
            setIsMobile(mql.matches);
            setIsDesktop(!mql.matches);
        };

        onChange();
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return { isMobile, isDesktop };
}
