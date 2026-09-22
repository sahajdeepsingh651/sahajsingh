"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export type HorizonMode = "ocean" | "3d" | "mist" | "rise" | "off";
export type HorizonDepth = 140 | 170 | 210;
export type TransitionSpeed = "instant" | "snappy";
export type BgOption = "default" | "candidate" | "none";

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
    const [bgOption, setBgOption] = useState<BgOption>("default");
    const [useFrostedBox, setUseFrostedBox] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isDark, setIsDark] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pathname = usePathname();

    // Check if the current route is an essay or thought reading page
    const isLongFormReading =
        pathname.startsWith("/essays/") || pathname.startsWith("/thoughts/");
    const effectiveMode = isLongFormReading ? "ocean" : mode;

    // Apply background art safely with strict dark-mode protection
    const applyBackground = useCallback((option: BgOption, darkMode: boolean) => {
        const body = document.body;
        if (!body) return;

        if (option === "none") {
            body.style.backgroundImage = "none";
        } else if (option === "candidate" && !darkMode) {
            // Candidate art is daylight warm parchment — only apply in light mode!
            body.style.backgroundImage = 'url("/candidate_bg.png")';
        } else {
            // In dark mode or default: let globals.css control theme background natively
            // (.dark body -> /real_write_mode.png, light -> /real_read_mode.png)
            body.style.backgroundImage = "";
        }
    }, []);

    // Restore saved preferences on mount
    useEffect(() => {
        try {
            const savedMode =
                (localStorage.getItem("horizon_mode") as HorizonMode) || "ocean";
            const savedDepth =
                (Number(localStorage.getItem("horizon_depth")) as HorizonDepth) || 170;
            const savedSpeed =
                (localStorage.getItem("horizon_speed") as TransitionSpeed) || "instant";
            const savedMask = localStorage.getItem("horizon_mask");
            const savedBg = (localStorage.getItem("experiment_bg") as BgOption) || "default";
            const savedBox = localStorage.getItem("glass_frame_box");

            setMode(savedMode);
            if ([140, 170, 210].includes(savedDepth)) setDepth(savedDepth);
            if (["instant", "snappy"].includes(savedSpeed)) setSpeed(savedSpeed);
            if (savedMask !== null) setIsMaskEnabled(savedMask === "true");
            if (["default", "candidate", "none"].includes(savedBg)) setBgOption(savedBg);
            if (savedBox !== null) setUseFrostedBox(savedBox === "true");

            const darkMode = document.documentElement.classList.contains("dark");
            setIsDark(darkMode);
            applyBackground(savedBg, darkMode);
        } catch {
            // Ignore localStorage errors
        }

        // Listen for theme toggle changes on <html>
        const observer = new MutationObserver(() => {
            const darkMode = document.documentElement.classList.contains("dark");
            setIsDark(darkMode);
            const currentBg =
                (localStorage.getItem("experiment_bg") as BgOption) || "default";
            applyBackground(currentBg, darkMode);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [applyBackground]);

    // Save preferences and apply background updates
    useEffect(() => {
        try {
            localStorage.setItem("horizon_mode", mode);
            localStorage.setItem("horizon_depth", depth.toString());
            localStorage.setItem("horizon_speed", speed);
            localStorage.setItem("horizon_mask", isMaskEnabled.toString());
            localStorage.setItem("experiment_bg", bgOption);
            localStorage.setItem("glass_frame_box", String(useFrostedBox));
            window.dispatchEvent(new Event("glass-box-toggle"));
        } catch {
            // Ignore localStorage errors
        }

        applyBackground(bgOption, isDark);
    }, [mode, depth, speed, isMaskEnabled, bgOption, useFrostedBox, isDark, applyBackground]);

    // Active scroll evaluation for discrete items (sections, list items)
    const updateElementStates = useCallback(() => {
        if (!containerRef.current || effectiveMode === "off" || effectiveMode === "ocean") {
            if (containerRef.current) {
                const elements = containerRef.current.querySelectorAll<HTMLElement>(
                    "[data-horizon-state]"
                );
                elements.forEach((el) => el.removeAttribute("data-horizon-state"));
            }
            return;
        }

        const horizonThreshold = window.innerHeight - depth;
        const targets = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
                "section, ul > li, ol > li, dl > div, .horizon-card"
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
    }, [effectiveMode, depth]);

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
            {/* Scoped CSS: Zero-delay optical horizon mask + optional snappy transitions */}
            <style jsx global>{`
                /* Viewport Optical Mask:
                   - Above (100vh - depth): 100% solid, crisp, and immediately readable (0ms delay).
                   - Between (100vh - depth) and bottom: smoothly dissolves behind the ocean waves.
                   - Text NEVER renders on top of the waves etching.
                   - 100% GPU-accelerated: 0ms delay, synchronized with scroll, identical in Light & Dark mode!
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

                /* Mode: Ocean Horizon (Pure Optical Mask) */
                .horizon-container[data-horizon-mode="ocean"] * {
                    pointer-events: auto !important;
                }

                /* Mode: 3D Perspective */
                .horizon-container[data-horizon-mode="3d"] {
                    perspective: 1000px;
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="hidden"] {
                    transform: rotateX(10deg) translateY(12px);
                    opacity: 0.7;
                    transition: ${speed === "instant"
                        ? "none"
                        : "transform 0.15s ease-out, opacity 0.12s ease-out"};
                }
                .horizon-container[data-horizon-mode="3d"] [data-horizon-state="visible"] {
                    transform: rotateX(0deg) translateY(0px);
                    opacity: 1;
                    transition: ${speed === "instant"
                        ? "none"
                        : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out"};
                }

                /* Mode: Coastal Mist */
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

                /* Mode: Rising Tide */
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="hidden"] {
                    transform: translateY(14px);
                    opacity: 0.75;
                    transition: ${speed === "instant"
                        ? "none"
                        : "transform 0.14s ease-out, opacity 0.12s ease-out"};
                }
                .horizon-container[data-horizon-mode="rise"] [data-horizon-state="visible"] {
                    transform: translateY(0px);
                    opacity: 1;
                    transition: ${speed === "instant"
                        ? "none"
                        : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out"};
                }
            `}</style>

            {/* Main Content Container: pb-52 guarantees final sentences clear the waves */}
            <div
                ref={containerRef}
                className="horizon-container relative min-h-[calc(100vh-140px)] pb-52 transition-all duration-300"
                data-horizon-mode={effectiveMode}
                data-mask={effectiveMode !== "off" && isMaskEnabled ? "true" : "false"}
            >
                {children}
            </div>

            {/* Interactive Horizon Experiment Controller */}
            <aside
                aria-label="Horizon Scroll & Background Dock"
                className="fixed left-4 sm:left-6 bottom-4 z-50 font-mono text-xs text-[var(--text-muted)]"
            >
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="px-3 py-1.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Open Visual Controls"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>🌊 Horizon Emergence: {effectiveMode}</span>
                        <span className="text-[var(--text-muted)]">[open]</span>
                    </button>
                ) : (
                    <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-80 max-w-[calc(100vw-2rem)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-current/10 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Horizon &amp; Atmosphere Controls
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                            >
                                [− minimize]
                            </button>
                        </div>

                        {/* 1. Behind Waves Mask Toggle */}
                        <div className="space-y-1 bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-[var(--text-color)]">
                                    Text Behind Waves:
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsMaskEnabled(true)}
                                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                            isMaskEnabled
                                                ? "bg-emerald-600 text-white font-medium"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                        }`}
                                    >
                                        ON (Optical)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsMaskEnabled(false)}
                                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                            !isMaskEnabled
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                        }`}
                                    >
                                        OFF
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                                Zero-lag GPU mask: text physically slips behind ocean waves without seams.
                            </p>
                        </div>

                        {/* 2. Frosted Card Box Toggle */}
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)]">Container Style:</span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setUseFrostedBox(false)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        !useFrostedBox
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    Borderless (Field)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUseFrostedBox(true)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        useFrostedBox
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    Card Box
                                </button>
                            </div>
                        </div>

                        {/* 3. Background Art Selection */}
                        <div className="space-y-1.5 pt-2 border-t border-current/10">
                            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                                Background Art
                            </span>
                            <div className="grid grid-cols-3 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setBgOption("default")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        bgOption === "default"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    Default
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBgOption("candidate")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        bgOption === "candidate"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                    title={
                                        isDark
                                            ? "Candidate art is daytime parchment (active in light mode)"
                                            : "Gemini candidate art"
                                    }
                                >
                                    Candidate {isDark ? "(day)" : "★"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBgOption("none")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-center border cursor-pointer transition-colors ${
                                        bgOption === "none"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    None
                                </button>
                            </div>
                            {isDark && bgOption === "candidate" && (
                                <p className="text-[10px] text-amber-500/90 leading-tight">
                                    Night mode uses cosmic art to protect contrast. Candidate art appears in light mode.
                                </p>
                            )}
                        </div>

                        {/* 4. Waterline Cutoff */}
                        <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)]">Waterline Depth:</span>
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

                        {/* 5. Scroll Dynamics Modes */}
                        <div className="pt-2 border-t border-current/10 space-y-1">
                            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                                Dynamics Mode
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setMode("ocean")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        effectiveMode === "ocean"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    🌊 Pure Optical (0ms)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("3d")}
                                    className={`px-1.5 py-1 rounded text-[10px] text-left border cursor-pointer transition-colors ${
                                        effectiveMode === "3d"
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
                                        effectiveMode === "mist"
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
                                        effectiveMode === "rise"
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    }`}
                                >
                                    ▲ Fast Rise
                                </button>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                            <span>Theme: <strong className="text-[var(--text-color)]">{isDark ? "Dark (Cosmic)" : "Light (Parchment)"}</strong></span>
                            <span className="text-emerald-500 font-medium">Active ✓</span>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
