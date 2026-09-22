"use client";

import { useState, useEffect } from "react";

export type GlassFrameMode = "card" | "unboxed" | "floating";

export default function GlassFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    // Default to 'card' so the user can immediately experience the focused essay frame!
    const [glassMode, setGlassMode] = useState<GlassFrameMode>("card");

    useEffect(() => {
        const handleGlassModeChange = (e: CustomEvent<GlassFrameMode>) => {
            setGlassMode(e.detail);
        };

        try {
            const saved = localStorage.getItem("glassframe_mode") as GlassFrameMode;
            if (saved && ["card", "unboxed", "floating"].includes(saved)) {
                setGlassMode(saved);
            }
        } catch {
            // Ignore localStorage errors in private mode
        }

        window.addEventListener("glassframe-mode-change" as any, handleGlassModeChange);
        return () => {
            window.removeEventListener("glassframe-mode-change" as any, handleGlassModeChange);
        };
    }, []);

    // Mode classes:
    // - card: Focused editorial frosted glass card with subtle border & backdrop blur
    // - unboxed: Pure open typography without borders
    // - floating: Glass card elevated above the ocean waves waterline
    const modeClasses = {
        card: "bg-[var(--bg-color)]/75 backdrop-blur-md border border-current/10 rounded-lg shadow-sm p-6 sm:p-10",
        unboxed: "bg-transparent border-transparent px-6 sm:px-8",
        floating: "bg-[var(--bg-color)]/80 backdrop-blur-md border border-current/10 rounded-lg shadow-md p-6 sm:p-10 mb-44",
    };

    return (
        <div
            className={`relative w-full max-w-6xl mx-auto my-6 sm:my-8 transition-all duration-300 ${modeClasses[glassMode]}`}
            data-glass-mode={glassMode}
        >
            {children}
        </div>
    );
}
