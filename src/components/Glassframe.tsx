"use client";

import { useState, useEffect } from "react";

export default function GlassFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    // Default: false (clean, borderless, allowing text to slip behind horizon in foreground)
    const [useFrostedBox, setUseFrostedBox] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("glass_frame_box");
        if (saved !== null) {
            setUseFrostedBox(saved === "true");
        }

        const handleSync = () => {
            const updated = localStorage.getItem("glass_frame_box");
            if (updated !== null) {
                setUseFrostedBox(updated === "true");
            }
        };

        window.addEventListener("glass-box-toggle", handleSync);
        return () => window.removeEventListener("glass-box-toggle", handleSync);
    }, []);

    return (
        <div
            className={`page-canvas relative w-full max-w-6xl mx-auto my-8 p-6 sm:p-8 transition-all duration-500 z-10 ${
                useFrostedBox
                    ? "border border-current/10 rounded-sm bg-[var(--bg-color)]/70 backdrop-blur-md"
                    : "border-none bg-transparent backdrop-blur-none"
            }`}
            style={{ paddingBottom: "var(--scroll-clearance, 45vh)" }}
        >
            {children}
        </div>
    );
}
