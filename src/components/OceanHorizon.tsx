"use client";

import { useState, useEffect } from "react";

export default function OceanHorizon() {
    const [depth, setDepth] = useState<number>(175);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

    useEffect(() => {
        const handleHorizonUpdate = (e: CustomEvent<{ depth?: number; enabled?: boolean }>) => {
            if (e.detail.depth !== undefined) setDepth(e.detail.depth);
            if (e.detail.enabled !== undefined) setIsEnabled(e.detail.enabled);
        };

        try {
            const savedDepth = Number(localStorage.getItem("horizon_depth"));
            const savedEnabled = localStorage.getItem("horizon_foreground");
            if (savedDepth && [140, 175, 210].includes(savedDepth)) setDepth(savedDepth);
            if (savedEnabled !== null) setIsEnabled(savedEnabled === "true");
        } catch {
            // Ignore localStorage errors
        }

        window.addEventListener("ocean-horizon-update" as any, handleHorizonUpdate);
        return () => {
            window.removeEventListener("ocean-horizon-update" as any, handleHorizonUpdate);
        };
    }, []);

    if (!isEnabled) return null;

    return (
        <aside
            aria-hidden="true"
            className="fixed bottom-0 left-0 right-0 pointer-events-none z-20 overflow-hidden select-none transition-all duration-300"
            style={{ height: `${depth}px` }}
        >
            {/* Water Depth Fill:
                Opaque gradient that physically covers text scrolling into the ocean waves */}
            <div
                className="absolute inset-0 transition-colors duration-300"
                style={{
                    background:
                        "linear-gradient(to top, var(--bg-color) 40%, var(--bg-color) 58%, transparent 100%)",
                }}
            />

            {/* Light Mode Ocean Waves Etching */}
            <div
                className="absolute inset-0 bg-bottom bg-no-repeat bg-[length:100%_auto] dark:hidden"
                style={{ backgroundImage: 'url("/real_read_mode.png")' }}
            />

            {/* Dark Mode Ocean Waves Etching + Glowing Lighthouse Beam */}
            <div
                className="absolute inset-0 bg-bottom bg-no-repeat bg-[length:100%_auto] hidden dark:block"
                style={{ backgroundImage: 'url("/real_write_mode.png")' }}
            />
        </aside>
    );
}
