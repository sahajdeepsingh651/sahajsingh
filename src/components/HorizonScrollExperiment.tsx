"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export type HorizonMode = "3d" | "mist" | "rise" | "off";
export type HorizonIntensity = "subtle" | "pronounced";

interface HorizonScrollExperimentProps {
    children: React.ReactNode;
}

export default function HorizonScrollExperiment({
    children,
}: HorizonScrollExperimentProps) {
    const [mode, setMode] = useState<HorizonMode>("3d");
    const [intensity, setIntensity] = useState<HorizonIntensity>("subtle");
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Restore saved preference on mount
    useEffect(() => {
        const savedMode = (localStorage.getItem("horizon_mode") as HorizonMode) || "3d";
        const savedIntensity = (localStorage.getItem("horizon_intensity") as HorizonIntensity) || "subtle";
        setMode(savedMode);
        setIntensity(savedIntensity);
    }, []);

    // Save preferences
    useEffect(() => {
        localStorage.setItem("horizon_mode", mode);
        localStorage.setItem("horizon_intensity", intensity);
    }, [mode, intensity]);

    // Attach scroll horizon observer to sections and elements
    useEffect(() => {
        if (mode === "off" || !containerRef.current) return;

        const container = containerRef.current;
        // Observe top-level semantic sections, articles, and list items
        const targets = container.querySelectorAll<HTMLElement>(
            "section, article > div, article > p, article > h2, ul.space-y-6 > li, header.pb-6"
        );

        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const target = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        target.setAttribute("data-horizon-state", "visible");
                    } else if (entry.boundingClientRect.top > 0) {
                        // Element is below the viewport threshold (beyond horizon)
                        target.setAttribute("data-horizon-state", "hidden");
                    }
                });
            },
            {
                rootMargin: "0px 0px -40px 0px",
                threshold: [0, 0.1],
            }
        );

        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            // If already on screen on initial load, show it; otherwise mark beyond horizon
            if (rect.top < window.innerHeight - 40) {
                el.setAttribute("data-horizon-state", "visible");
            } else {
                el.setAttribute("data-horizon-state", "hidden");
            }
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
            targets.forEach((el) => {
                el.removeAttribute("data-horizon-state");
            });
        };
    }, [mode, intensity, pathname]);

    // Dynamic variable styling based on intensity
    const tilt = intensity === "pronounced" ? "26deg" : "16deg";
    const yShift = intensity === "pronounced" ? "65px" : "38px";
    const blurAmount = intensity === "pronounced" ? "3px" : "1.5px";
    const scaleFactor = intensity === "pronounced" ? "0.94" : "0.97";

    return (
        <>
            {/* Scoped CSS for the Horizon Perspective and Atmosphere */}
            <style jsx global>{`
                .horizon-container[data-horizon-mode="3d"] {
                    perspective: 1100px;
                    perspective-origin: center 40%;
                }

                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="hidden"] {
                    transform: rotateX(${tilt}) translateY(${yShift}) scale(${scaleFactor});
                    opacity: 0.15;
                    filter: blur(${blurAmount});
                    transform-origin: center bottom;
                    pointer-events: none;
                }

                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="visible"] {
                    transform: rotateX(0deg) translateY(0px) scale(1);
                    opacity: 1;
                    filter: blur(0px);
                    transform-origin: center bottom;
                    transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                                opacity 0.85s ease-out,
                                filter 0.85s ease-out;
                }

                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="hidden"] {
                    transform: translateY(${yShift});
                    opacity: 0.1;
                    filter: blur(${intensity === "pronounced" ? "4px" : "2.5px"});
                    pointer-events: none;
                }

                .horizon-container[data-horizon-mode="mist"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    filter: blur(0px);
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                                opacity 0.8s ease-out,
                                filter 0.8s ease-out;
                }

                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="hidden"] {
                    transform: translateY(${intensity === "pronounced" ? "80px" : "45px"});
                    opacity: 0;
                    pointer-events: none;
                }

                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: transform 0.9s cubic-bezier(0.18, 0.9, 0.25, 1),
                                opacity 0.8s ease-out;
                }
            `}</style>

            {/* The Main Content Container wrapped with horizon attributes */}
            <div
                ref={containerRef}
                className="horizon-container relative transition-all duration-300"
                data-horizon-mode={mode}
            >
                {children}
            </div>

            {/* Optional Horizon Mist Line when in Mist mode */}
            {mode === "mist" && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/70 to-transparent z-20 transition-opacity duration-300"
                />
            )}

            {/* Interactive Horizon Experiment Controller */}
            <aside
                aria-label="Horizon Scroll Experiment Dock"
                className="fixed right-4 sm:right-6 bottom-6 z-50 font-mono text-xs text-[var(--text-muted)]"
            >
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="px-3 py-2 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Open Horizon Scroll Controller"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>🌅 Horizon: {mode === "3d" ? "3D Curve" : mode}</span>
                        <span className="text-[var(--text-muted)]">[open]</span>
                    </button>
                ) : (
                    <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-72 max-w-[calc(100vw-2rem)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-current/10 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                Horizon Scroll Experiment
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                                title="Minimize controller to corner"
                            >
                                [− minimize]
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
                                    onClick={() => setMode("3d")}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "3d"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ✦ 3D Horizon
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
                                    className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                        mode === "off"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ✕ Off (Static)
                                </button>
                            </div>
                        </div>

                        {/* Intensity Setting (when not off) */}
                        {mode !== "off" && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                                <span className="text-[var(--text-muted)]">Intensity:</span>
                                <div className="flex items-center gap-1">
                                    {(["subtle", "pronounced"] as const).map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setIntensity(lvl)}
                                            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                                intensity === lvl
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Readout */}
                        <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                            <span>Active: <strong className="text-[var(--text-color)]">{mode}</strong> ({intensity})</span>
                            <span className="text-cyan-500 font-medium">Scroll to test</span>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
