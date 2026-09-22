"use client";

import { useEffect, useState } from "react";

export default function HorizonForeground() {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("horizon_foreground");
        if (saved !== null) {
            setActive(saved === "true");
        }

        const handleSync = () => {
            const updated = localStorage.getItem("horizon_foreground");
            if (updated !== null) {
                setActive(updated === "true");
            }
        };

        window.addEventListener("horizon-toggle", handleSync);
        return () => window.removeEventListener("horizon-toggle", handleSync);
    }, []);

    if (!active) return null;

    return (
        <div
            aria-hidden="true"
            className="fixed bottom-0 left-0 right-0 pointer-events-none z-20 select-none overflow-hidden transition-all duration-300"
            style={{
                height: "clamp(120px, 18vw, 200px)",
            }}
        >
            {/* Light mode foreground horizon (sea, waves, rocks, lighthouse) */}
            <div
                className="dark:hidden w-full h-full bg-no-repeat bg-bottom bg-[length:100%_auto]"
                style={{
                    backgroundImage: 'url("/horizon_foreground_light.png")',
                }}
            />
            {/* Dark mode foreground horizon */}
            <div
                className="hidden dark:block w-full h-full bg-no-repeat bg-bottom bg-[length:100%_auto]"
                style={{
                    backgroundImage: 'url("/horizon_foreground_dark.png")',
                }}
            />
        </div>
    );
}
