"use client";

import { useEffect, useState } from "react";

export default function HorizonForeground() {
    const [active, setActive] = useState(true);
    const [bgSize, setBgSize] = useState<string>("100% auto");
    const [bgPosition, setBgPosition] = useState<string>("bottom center");

    useEffect(() => {
        // Ensure horizon foreground is active so text emerges from behind ocean waves
        setActive(true);
        localStorage.setItem("horizon_foreground", "true");
        const savedSize = localStorage.getItem("experiment_bg_size");
        if (savedSize) setBgSize(savedSize);
        const savedPos = localStorage.getItem("experiment_bg_pos");
        if (savedPos) setBgPosition(savedPos);

        const handleSync = () => {
            const updated = localStorage.getItem("horizon_foreground");
            if (updated !== null) {
                setActive(updated === "true");
            }
        };

        const handleStyleChange = (e: Event) => {
            const custom = e as CustomEvent<{ size?: string; pos?: string }>;
            if (custom.detail?.size) setBgSize(custom.detail.size);
            if (custom.detail?.pos) setBgPosition(custom.detail.pos);
        };

        window.addEventListener("horizon-toggle", handleSync);
        window.addEventListener("horizon-style-change", handleStyleChange);
        return () => {
            window.removeEventListener("horizon-toggle", handleSync);
            window.removeEventListener("horizon-style-change", handleStyleChange);
        };
    }, []);

    if (!active) return null;

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden"
        >
            {/* Light mode foreground horizon (sea, waves, rocks, lighthouse) */}
            <div
                className="dark:hidden w-full h-full bg-no-repeat transition-all duration-300"
                style={{
                    backgroundImage: 'url("/horizon_foreground_light.png")',
                    backgroundSize: bgSize,
                    backgroundPosition: bgPosition,
                }}
            />
            {/* Dark mode foreground horizon */}
            <div
                className="hidden dark:block w-full h-full bg-no-repeat transition-all duration-300"
                style={{
                    backgroundImage: 'url("/horizon_foreground_dark.png")',
                    backgroundSize: bgSize,
                    backgroundPosition: bgPosition,
                }}
            />
        </div>
    );
}
