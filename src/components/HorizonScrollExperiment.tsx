"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export type HorizonMode = "ocean" | "3d" | "mist" | "rise" | "off";
export type HorizonDepth = 140 | 170 | 210;
export type TransitionSpeed = "instant" | "snappy";

interface HorizonScrollExperimentProps {
    children: React.ReactNode;
}

export default function HorizonScrollExperiment({
    children,
}: HorizonScrollExperimentProps) {
    // Default to 'ocean' (pure optical mask with zero transition delay)
    const [mode, setMode] = useState<HorizonMode>("ocean");
    const [depth, setDepth] = useState<HorizonDepth>(170);
    const [speed, setSpeed] = useState<TransitionSpeed>("instant");
    const [isMaskEnabled, setIsMaskEnabled] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [submergedCount, setSubmergedCount] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pathname = usePathname();

    // Check if the current route is an essay or thought reading page
    const isLongFormReading = pathname.startsWith("/essays/") || pathname.startsWith("/thoughts/");
    const effectiveMode = isLongFormReading ? "ocean" : mode;

    // Restore saved preferences on mount
    useEffect(() => {
        try {
            const savedMode = (localStorage.getItem("horizon_mode") as HorizonMode) || "ocean";
            const savedDepth = Number(localStorage.getItem("horizon_depth")) as HorizonDepth || 170;
            const savedSpeed = (localStorage.getItem("horizon_speed") as TransitionSpeed) || "instant";
            const savedMask = localStorage.getItem("horizon_mask");

            setMode(savedMode);
            if ([140, 170, 210].includes(savedDepth)) setDepth(savedDepth);
            if (["instant", "snappy"].includes(savedSpeed)) setSpeed(savedSpeed);
            if (savedMask !== null) setIsMaskEnabled(savedMask === "true");
        } catch {
            // Ignore localStorage errors in private browsing
        }
    }, []);

    // Save preferences
    useEffect(() => {
        try {
            localStorage.setItem("horizon_mode", mode);
            localStorage.setItem("horizon_depth", depth.toString());
            localStorage.setItem("horizon_speed", speed);
            localStorage.setItem("horizon_mask", isMaskEnabled.toString());
        } catch {
            // Ignore localStorage errors
        }
    }, [mode, depth, speed, isMaskEnabled]);

    // Active scroll evaluation for discrete items (sections, list items)
    const updateElementStates = useCallback(() => {
        if (!containerRef.current || effectiveMode === "off" || effectiveMode === "ocean") {
            // In 'ocean' mode or 'off' mode, the optical mask handles emergence with 0ms delay.
            // No delayed transforms or opacity reduction are applied to reading text.
            if (containerRef.current) {
                const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-horizon-state]");
                elements.forEach((el) => el.removeAttribute("data-horizon-state"));
            }
            setSubmergedCount(0);
            return;
        }

        const horizonThreshold = window.innerHeight - depth;

        // In 3D / rise modes, track semantic containers and list items (never individual markdown reading paragraphs)
        const targets = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
                "section, ul > li, ol > li, dl > div, .horizon-card"
            )
        );

        let submerged = 0;

        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top > horizonThreshold) {
                el.setAttribute("data-horizon-state", "hidden");
                submerged++;
            } else {
                el.setAttribute("data-horizon-state", "visible");
            }
        });

        setSubmergedCount(submerged);
    }, [mode, depth]);

    // Scroll, resize, and route change listener
    useEffect(() => {
        if (effectiveMode === "off" || effectiveMode === "ocean") {
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
    }, [effectiveMode, depth, pathname, updateElementStates]);

    return (
        <>
            {/* Scoped CSS: Zero-delay optical horizon mask + optional snappy tactile transitions */}
            <style jsx global>{`
                /* Viewport Mask:
                   - Above (100vh - depth): 100% solid, crisp, and immediately readable (0ms delay).
                   - Between (100vh - depth) and bottom: smoothly dissolves behind the ocean waves.
                   - Text NEVER renders on top of the waves etching.
                   - Completely GPU-accelerated: 0ms JavaScript delay, perfectly synced with scroll!
                */
                .horizon-container[data-mask="true"] {
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black calc(100vh - ${depth}px),
                        rgba(0, 0, 0, 0.4) calc(100vh - ${Math.round(depth * 0.65)}px),
                        transparent calc(100vh - ${Math.round(depth * 0.2)}px)
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black calc(100vh - ${depth}px),
                        rgba(0, 0, 0, 0.4) calc(100vh - ${Math.round(depth * 0.65)}px),
                        transparent calc(100vh - ${Math.round(depth * 0.2)}px)
                    );
                }

                /* Mode: Ocean Horizon (Pure Optical Mask)
                   No artificial animation delays, no dimmed text, no float. 100% reader focus. */
                .horizon-container[data-horizon-mode="ocean"] * {
                    pointer-events: auto !important;
                }

                /* Mode: 3D Perspective (Snappy, non-blocking) */
                .horizon-container[data-horizon-mode="3d"] {
                    perspective: 1000px;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="hidden"] {
                    transform: rotateX(10deg) translateY(12px);
                    opacity: 0.7;
                    transition: ${speed === "instant" ? "none" : "transform 0.15s ease-out, opacity 0.12s ease-out"};
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="visible"] {
                    transform: rotateX(0deg) translateY(0px);
                    opacity: 1;
                    transition: ${speed === "instant" ? "none" : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out"};
                }

                /* Mode: Coastal Mist (Soft waterline ambient haze, 0ms lag) */
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="hidden"] {
                    filter: blur(1.5px);
                    opacity: 0.8;
                    transition: ${speed === "instant" ? "none" : "filter 0.15s ease, opacity 0.15s ease"};
                }
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="visible"] {
                    filter: blur(0px);
                    opacity: 1;
                    transition: ${speed === "instant" ? "none" : "filter 0.15s ease, opacity 0.15s ease"};
                }

                /* Mode: Rising Tide (Quick 12px buoyant lift) */
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="hidden"] {
                    transform: translateY(14px);
                    opacity: 0.75;
                    transition: ${speed === "instant" ? "none" : "transform 0.14s ease-out, opacity 0.12s ease-out"};
                }
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: ${speed === "instant" ? "none" : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out"};
                }
            `}</style>

            {/* The Main Content Container:
                - min-h ensures comfortable reading flow
                - pb-48 allows the final lines and footer to clear the ocean waves completely
            */}
            <div
                ref={containerRef}
                className="horizon-container relative min-h-[calc(100vh-140px)] pb-48 sm:pb-60 transition-all duration-300"
                data-horizon-mode={effectiveMode}
                data-mask={effectiveMode !== "off" && isMaskEnabled ? "true" : "false"}
            >
                {children}
            </div>

            {/* Interactive Horizon Experiment Controller */}
            <aside
                aria-label="Horizon Scroll Experiment Dock"
                className="fixed right-4 sm:right-6 bottom-4 z-50 font-mono text-xs text-[var(--text-muted)]"
            >
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="px-3 py-2 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Open Horizon Controller"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>
                            🌊 Horizon: {mode === "ocean" ? "Reading Mode (0ms delay)" : mode} ({depth}px)
                        </span>
                        <span className="text-[var(--text-muted)]">[open]</span>
                    </button>
                ) : (
                    <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-80 max-w-[calc(100vw-2rem)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-current/10 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                Ocean Horizon (Reading Mode)
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

                        {/* Reading Context Badge */}
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                            <span>
                                Context:{" "}
                                <strong className="text-[var(--text-color)]">
                                    {isLongFormReading ? "Essay / Reading" : pathname}
                                </strong>
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                0ms delay active
                            </span>
                        </div>

                        {/* Mode Selection */}
                        <div className="space-y-1.5">
                            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                                Emergence Mode
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("ocean");
                                        setSpeed("instant");
                                    }}
                                    className={`col-span-2 px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "ocean"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    🌊 Pure Reading (0ms delay — Optical Mask)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("3d")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "3d"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    🌅 Snappy 3D
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("mist")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "mist"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ☁ Coastal Mist
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("rise")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "rise"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ▲ Fast Rise
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("off")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "off"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ✕ Off (Static Overlap)
                                </button>
                            </div>
                        </div>

                        {/* Speed Control (when not off) */}
                        {mode !== "off" && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Transition Speed:</span>
                                <div className="flex items-center gap-1">
                                    {(["instant", "snappy"] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSpeed(s)}
                                            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                                speed === s
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                            }`}
                                        >
                                            {s === "instant" ? "Instant (0ms)" : "Snappy (150ms)"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Horizon Waterline Cutoff */}
                        {mode !== "off" && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Wave Horizon:</span>
                                <div className="flex items-center gap-1">
                                    {([140, 170, 210] as const).map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => setDepth(h)}
                                            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                                depth === h
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                            }`}
                                        >
                                            {h}px {h === 170 ? "(std)" : h === 210 ? "(deep)" : "(low)"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Occlusion Mask Toggle */}
                        {mode !== "off" && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Behind Waves:</span>
                                <button
                                    type="button"
                                    onClick={() => setIsMaskEnabled(!isMaskEnabled)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        isMaskEnabled
                                            ? "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-medium"
                                            : "bg-red-500/10 text-red-500 font-medium"
                                    }`}
                                >
                                    {isMaskEnabled ? "[Mask: ON]" : "[Mask: OFF]"}
                                </button>
                            </div>
                        )}

                        {/* Reading Explanation Note */}
                        <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] leading-relaxed">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Zero Lag:</span>{" "}
                            Text is 100% solid and clickable above the waves with no animation delay. Text emerges organically at 1:1 scroll speed.
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
