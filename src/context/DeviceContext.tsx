"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useDevice, DeviceType } from "@/hooks/useDevice";

interface DeviceContextType {
    device: DeviceType;
    isMobile: boolean;
    isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
    const deviceState = useDevice();

    return (
        <DeviceContext.Provider value={deviceState}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDeviceContext() {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error("useDeviceContext must be used within a DeviceProvider");
    }
    return context;
}
