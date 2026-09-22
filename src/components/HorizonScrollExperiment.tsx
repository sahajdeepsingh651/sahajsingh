"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { GlassFrameMode } from "./Glassframe";

export type HorizonMode = "ocean" | "3d" | "mist" | "rise" | "off";
export type HorizonDepth = 140 | 175 | 210;

interface HorizonScrollExperimentProps {
    children: React.ReactNode;
}

export default function HorizonScrollExperiment({
    children,
}: HorizonScrollExperimentProps) {
    const [mode, setMode] = useState<HorizonMode>("ocean");
    const [depth, setDepth] = useState<HorizonDepth>(175);
    const [glassMode, setGlassMode] = useState<GlassFrameMode>("card");
    const [isWavesInFront, setIsWavesInFront] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pathname = usePathname();

    // Check if the current route is an essay or thought reading page
    const isLongFormReading = pathname.startsWith("/essays/") || pathname.startsWith("/thoughts/");

    // Restore saved preferences on mount
    useEffect(() => {
        try {
            const savedMode = (localStorage.getItem("horizon_mode") as HorizonMode) || "ocean";
            const savedDepth = Number(localStorage.getItem("horizon_depth")) as HorizonDepth || 175;
            const savedGlass = (localStorage.getItem("glassframe_mode") as GlassFrameMode) || "card";
            const savedWaves = localStorage.getItem("horizon_foreground");

            setMode(savedMode);
            if ([140, 175, 210].includes(savedDepth)) setDepth(savedDepth);
            if (["card", "unboxed", "floating"].includes(savedGlass)) setGlassMode(savedGlass);
            if (savedWaves !== null) setIsWavesInFront(savedWaves === "true");
        } catch {
            // Ignore localStorage errors in private browsing
        }
    }, []);

    // Change GlassFrame style dynamically
    const handleGlassModeSelect = (newGlass: GlassFrameMode) => {
        setGlassMode(newGlass);
        try {
            localStorage.setItem("glassframe_mode", newGlass);
        } catch {}
        window.dispatchEvent(new CustomEvent("glassframe-mode-change", { detail: newGlass }));
    };

    // Toggle Foreground Ocean Waves
    const handleWavesToggle = (enabled: boolean) => {
        setIsWavesInFront(enabled);
        try {
            localStorage.setItem("horizon_foreground", enabled.toString());
        } catch {}
        window.dispatchEvent(new CustomEvent("ocean-horizon-update", { detail: { enabled } }));
    };

    // Change Ocean Wave Horizon Depth
    const handleDepthSelect = (newDepth: HorizonDepth) => {
        setDepth(newDepth);
        try {
            localStorage.setItem("horizon_depth", newDepth.toString());
        } catch {}
        window.dispatchEvent(new CustomEvent("ocean-horizon-update", { detail: { depth: newDepth } }));
    };

    // Active scroll evaluation for optional 3D / rise tactile effects on cards
    const updateElementStates = useCallback(() => {
        if (!containerRef.current || mode === "off" || mode === "ocean") {
            if (containerRef.current) {
                const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-horizon-state]");
                elements.forEach((el) => el.removeAttribute("data-horizon-state"));
            }
            return;
        }

        const horizonThreshold = window.innerHeight - depth;
        // In 3D / rise mode, only target major section containers and list cards
        const targets = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
                "section, ul > li, ol > li, dl > div"
            )
        );

        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top > horizonThreshold) {
                el.setAttribute("data-horizon-state", "hidden");
            } else {
                el.setAttribute("data-horizon-state", "visible");
            }
        });
    }, [mode, depth]);

    useEffect(() => {
        if (mode === "off" || mode === "ocean") {
            updateElementStates();
            return;
        }

        const handleScrollOrResize = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateElementStates);
        };

        handleScrollOrResize();
        const t1 = setTimeout(handleScrollOrResize, 50);

        window.addEventListener("scroll", handleScrollOrResize, { passive: true });
        window.addEventListener("resize", handleScrollOrResize, { passive: true });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            clearTimeout(t1);
            window.removeEventListener("scroll", handleScrollOrResize);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [mode, depth, pathname, updateElementStates]);

    return (
        <>
            {/* Scoped CSS for optional tactile transforms */}
            <style jsx global>{`
                /* Mode: 3D Perspective (Tactile relief on cards) */
                .horizon-container[data-horizon-mode="3d"] {
                    perspective: 1000px;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="hidden"] {
                    transform: rotateX(8deg) translateY(12px);
                    opacity: 0.75;
                    transition: transform 0.15s ease-out, opacity 0.12s ease-out;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="visible"] {
                    transform: rotateX(0deg) translateY(0px);
                    opacity: 1;
                    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out;
                }

                /* Mode: Coastal Mist (Soft ambient haze) */
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="hidden"] {
                    filter: blur(1.5px);
                    opacity: 0.8;
                    transition: filter 0.15s ease, opacity 0.15s ease;
                }
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="visible"] {
                    filter: blur(0px);
                    opacity: 1;
                    transition: filter 0.15s ease, opacity 0.15s ease;
                }

                /* Mode: Rising Tide (Quick 12px buoyant lift) */
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="hidden"] {
                    transform: translateY(12px);
                    opacity: 0.75;
                    transition: transform 0.14s ease-out, opacity 0.12s ease-out;
                }
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out;
                }
            `}</style>

            {/* The Main Content Container:
                - pb-48 sm:pb-60 ensures that when scrolled all the way to the bottom,
                  the final content clears the ocean waves completely for easy reading.
            */}
            <div
                ref={containerRef}
                className="horizon-container relative pb-48 sm:pb-60 transition-all duration-300"
                data-horizon-mode={isLongFormReading ? "ocean" : mode}
            >
                {children}
            </div>

            {/* Interactive Horizon & Glassframe Switcher Dock */}
            <aside
                aria-label="Horizon and Glassframe Controller"
                className="fixed right-4 sm:right-6 bottom-4 z-50 font-mono text-xs text-[var(--text-muted)]"
            >
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="px-3 py-2 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Open Horizon & Glassframe Controller"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>
                            🌊 Waves: {isWavesInFront ? "In Front" : "Behind"} • Glass: {glassMode}
                        </span>
                        <span className="text-[var(--text-muted)]">[open]</span>
                    </button>
                ) : (
                    <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-84 max-w-[calc(100vw-2rem)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-current/10 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                Horizon &amp; Glassframe Lab
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                                title="Minimize controller"
                            >
                                [− close]
                            </button>
                        </div>

                        {/* 1. Glassframe Mode: Focus Card vs Floating vs Unboxed */}
                        <div className="space-y-1.5">
                            <div className="flex items-baseline justify-between">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                    1. Glassframe Style
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">
                                    active: <strong className="text-[var(--text-color)]">{glassMode}</strong>
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleGlassModeSelect("card")}
                                    className={`px-1.5 py-1.5 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        glassMode === "card"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                    title="Frosted glass card that frames the essay and scrolls behind waves"
                                >
                                    Focused Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleGlassModeSelect("floating")}
                                    className={`px-1.5 py-1.5 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        glassMode === "floating"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                    title="Glass card elevated above the ocean wave waterline"
                                >
                                    Floating Above
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleGlassModeSelect("unboxed")}
                                    className={`px-1.5 py-1.5 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        glassMode === "unboxed"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                    title="Clean borderless typography"
                                >
                                    Unboxed
                                </button>
                            </div>
                        </div>

                        {/* 2. Ocean Waves Layer (In Front vs Behind) */}
                        <div className="pt-2 border-t border-current/10 space-y-1.5">
                            <div className="flex items-baseline justify-between">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                    2. Ocean Waves Layer
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleWavesToggle(!isWavesInFront)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer font-medium transition-colors ${
                                        isWavesInFront
                                            ? "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-amber-600/20 text-amber-600 dark:text-amber-400"
                                    }`}
                                >
                                    {isWavesInFront ? "✓ In Front (Text Behind Waves)" : "✕ Behind (Text Overlaps)"}
                                </button>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                                {isWavesInFront
                                    ? "Waves sit in foreground at z-20. When you scroll, text glides BEHIND the ocean waves."
                                    : "Waves sit in body background at z-0. Text scrolls on top of the waves."}
                            </p>
                        </div>

                        {/* 3. Wave Waterline Height */}
                        {isWavesInFront && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Wave Height:</span>
                                <div className="flex items-center gap-1">
                                    {([140, 175, 210] as const).map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => handleDepthSelect(h)}
                                            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                                depth === h
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                            }`}
                                        >
                                            {h}px {h === 175 ? "(std)" : h === 210 ? "(deep)" : "(low)"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Scroll Emergence Dynamics */}
                        <div className="pt-2 border-t border-current/10 space-y-1.5">
                            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                3. Scroll Dynamics
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setMode("ocean")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        mode === "ocean"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    🌊 Pure 1:1 Flow (0ms)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("3d")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        mode === "3d"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    🌅 Snappy 3D
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("mist")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        mode === "mist"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    ☁ Coastal Mist
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("rise")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        mode === "rise"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    ▲ Buoyant Lift
                                </button>
                            </div>
                        </div>

                        {/* Reading Explanation Note */}
                        <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] leading-relaxed">
                            <span>Route: <strong className="text-[var(--text-color)]">{pathname}</strong></span>
                            <p className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                                Text physically scrolls behind the ocean waves with zero delay.
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
