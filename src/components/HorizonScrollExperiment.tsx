"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export type HorizonMode = "ocean" | "3d" | "mist" | "rise" | "off";
export type HorizonDepth = 140 | 180 | 220;

interface HorizonScrollExperimentProps {
    children: React.ReactNode;
}

export default function HorizonScrollExperiment({
    children,
}: HorizonScrollExperimentProps) {
    const [mode, setMode] = useState<HorizonMode>("ocean");
    const [depth, setDepth] = useState<HorizonDepth>(180);
    const [isMaskEnabled, setIsMaskEnabled] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [submergedCount, setSubmergedCount] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pathname = usePathname();

    // Restore saved preference on mount
    useEffect(() => {
        try {
            const savedMode = (localStorage.getItem("horizon_mode") as HorizonMode) || "ocean";
            const savedDepth = Number(localStorage.getItem("horizon_depth")) as HorizonDepth || 180;
            const savedMask = localStorage.getItem("horizon_mask");
            setMode(savedMode);
            if ([140, 180, 220].includes(savedDepth)) setDepth(savedDepth);
            if (savedMask !== null) setIsMaskEnabled(savedMask === "true");
        } catch {
            // Ignore localStorage errors in private mode
        }
    }, []);

    // Save preferences
    useEffect(() => {
        try {
            localStorage.setItem("horizon_mode", mode);
            localStorage.setItem("horizon_depth", depth.toString());
            localStorage.setItem("horizon_mask", isMaskEnabled.toString());
        } catch {
            // Ignore localStorage errors
        }
    }, [mode, depth, isMaskEnabled]);

    // Active scroll evaluation: tracks elements crossing the ocean waves threshold
    const updateElementStates = useCallback(() => {
        if (!containerRef.current || mode === "off") {
            setSubmergedCount(0);
            return;
        }

        const horizonThreshold = window.innerHeight - depth;
        const targets = containerRef.current.querySelectorAll<HTMLElement>(
            "section, article, ul.space-y-3 > li, ul.space-y-4 > li, ul.space-y-6 > li, .horizon-item"
        );

        let submerged = 0;

        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            // If top is beyond the horizon threshold, mark it submerged behind waves
            if (rect.top > horizonThreshold) {
                el.setAttribute("data-horizon-state", "hidden");
                submerged++;
            } else {
                el.setAttribute("data-horizon-state", "visible");
            }
        });

        setSubmergedCount(submerged);
    }, [mode, depth]);

    // Scroll and resize listener
    useEffect(() => {
        if (mode === "off") {
            if (containerRef.current) {
                const targets = containerRef.current.querySelectorAll<HTMLElement>("[data-horizon-state]");
                targets.forEach((el) => el.removeAttribute("data-horizon-state"));
            }
            setSubmergedCount(0);
            return;
        }

        const handleScrollOrResize = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateElementStates);
        };

        // Initial measurement
        handleScrollOrResize();

        window.addEventListener("scroll", handleScrollOrResize, { passive: true });
        window.addEventListener("resize", handleScrollOrResize, { passive: true });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", handleScrollOrResize);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [mode, depth, pathname, updateElementStates]);

    return (
        <>
            {/* Scoped CSS for the Horizon Perspective, Emergence, and Viewport Masking */}
            <style jsx global>{`
                /* Viewport Mask: ensures thoughts and content dissolve behind the ocean waves */
                .horizon-container[data-mask="true"] {
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black calc(100vh - ${depth}px),
                        rgba(0, 0, 0, 0.4) calc(100vh - ${Math.round(depth * 0.6)}px),
                        transparent calc(100vh - ${Math.round(depth * 0.2)}px)
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black calc(100vh - ${depth}px),
                        rgba(0, 0, 0, 0.4) calc(100vh - ${Math.round(depth * 0.6)}px),
                        transparent calc(100vh - ${Math.round(depth * 0.2)}px)
                    );
                }

                /* Mode: Ocean Horizon (Pure clean emergence from behind waves) */
                .horizon-container[data-horizon-mode="ocean"] [data-horizon-state="hidden"] {
                    transform: translateY(18px);
                    opacity: 0.25;
                    pointer-events: none;
                    transition: transform 0.4s ease-out, opacity 0.35s ease-out;
                }
                .horizon-container[data-horizon-mode="ocean"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out;
                }

                /* Mode: 3D Curve (Curving over the earth/ocean horizon) */
                .horizon-container[data-horizon-mode="3d"] {
                    perspective: 1000px;
                    perspective-origin: center 75%;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="hidden"] {
                    transform: rotateX(22deg) translateY(32px) scale(0.96);
                    opacity: 0.15;
                    transform-origin: center bottom;
                    pointer-events: none;
                    transition: transform 0.45s ease-out, opacity 0.35s ease-out;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="visible"] {
                    transform: rotateX(0deg) translateY(0px) scale(1);
                    opacity: 1;
                    transform-origin: center bottom;
                    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
                }

                /* Mode: Coastal Mist (Soft sea-fog dissolution at the waterline) */
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="hidden"] {
                    transform: translateY(24px);
                    filter: blur(3.5px);
                    opacity: 0.1;
                    pointer-events: none;
                    transition: transform 0.45s ease, filter 0.35s ease, opacity 0.35s ease;
                }
                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    filter: blur(0px);
                    opacity: 1;
                    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.55s ease, opacity 0.55s ease;
                }

                /* Mode: Rising Tide (Kinetic buoyant upward float) */
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="hidden"] {
                    transform: translateY(48px);
                    opacity: 0;
                    pointer-events: none;
                    transition: transform 0.4s ease-out, opacity 0.3s ease-out;
                }
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
                }
            `}</style>

            {/* The Main Content Container with bottom padding so thoughts can scroll completely clear of waves */}
            <div
                ref={containerRef}
                className="horizon-container relative pb-48 sm:pb-60 transition-all duration-300"
                data-horizon-mode={mode}
                data-mask={mode !== "off" && isMaskEnabled ? "true" : "false"}
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
                        title="Open Horizon Emergence Controller"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>
                            🌊 Horizon: {mode === "ocean" ? "Ocean Waves" : mode === "3d" ? "3D Curve" : mode} ({depth}px)
                        </span>
                        <span className="text-[var(--text-muted)]">[open]</span>
                    </button>
                ) : (
                    <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-80 max-w-[calc(100vw-2rem)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-current/10 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                Ocean Horizon Emergence
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

                        {/* Mode Selection */}
                        <div className="space-y-1.5">
                            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                                Emergence Mode
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setMode("ocean")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "ocean"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    🌊 Ocean Horizon
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
                                    🌅 3D Curve
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
                                    ▲ Rising Tide
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("off")}
                                    className={`col-span-2 px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "off"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ✕ Off (Static Overlap — shows text collision)
                                </button>
                            </div>
                        </div>

                        {/* Horizon Depth / Waterline Cutoff */}
                        {mode !== "off" && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Wave Horizon:</span>
                                <div className="flex items-center gap-1">
                                    {([140, 180, 220] as const).map((h) => (
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
                                            {h}px {h === 180 ? "(std)" : h === 220 ? "(high)" : "(low)"}
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

                        {/* Status Readout */}
                        <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span>Glassframe card:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Removed ✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Submerged elements:</span>
                                <span className="text-cyan-500 font-medium">
                                    {mode === "off" ? "0 (off)" : `${submergedCount} behind waves`}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
