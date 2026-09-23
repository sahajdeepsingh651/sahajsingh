"use client";

import { useEffect, useState } from "react";

export type ScrollCueMode = "pill" | "tick" | "peek" | "drift" | "none";
export type ScrollFogMode = "none" | "subtle" | "pronounced";

const robustScrollBy = (pixels: number) => {
    const startY = window.scrollY || document.documentElement.scrollTop || 0;
    const targetY = startY + pixels;
    try {
        window.scrollTo({ top: targetY, behavior: "smooth" });
    } catch {}
    try {
        if (document.documentElement && document.documentElement.scrollTo) {
            document.documentElement.scrollTo({ top: targetY, behavior: "smooth" });
        }
    } catch {}
    setTimeout(() => {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        if (Math.abs(currentY - startY) < 5 && pixels !== 0) {
            window.scrollBy(0, pixels);
            if (document.documentElement) document.documentElement.scrollTop += pixels;
        }
    }, 60);
};

const robustScrollTo = (top: number) => {
    try {
        window.scrollTo({ top, behavior: "smooth" });
    } catch {}
    try {
        if (document.documentElement && document.documentElement.scrollTo) {
            document.documentElement.scrollTo({ top, behavior: "smooth" });
        }
    } catch {}
    setTimeout(() => {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        if (Math.abs(currentY - top) > 10) {
            window.scrollTo(0, top);
            if (document.documentElement) document.documentElement.scrollTop = top;
        }
    }, 60);
};

export default function ScrollCue() {
    const [scrolled, setScrolled] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(true);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [cueMode, setCueMode] = useState<ScrollCueMode>("pill");
    const [fogMode, setFogMode] = useState<ScrollFogMode>("none");
    const [dockSide, setDockSide] = useState<"right" | "left">("right");

    useEffect(() => {
        const loadPreferences = () => {
            const savedMode = (localStorage.getItem("experiment_scroll_cue") as ScrollCueMode) || "pill";
            const savedFog = (localStorage.getItem("experiment_scroll_fog") as ScrollFogMode) || "none";
            const savedDockSide = (localStorage.getItem("experiment_dock_side") as "right" | "left") || "right";
            setCueMode(savedMode);
            setFogMode(savedFog);
            setDockSide(savedDockSide);
        };

        loadPreferences();

        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ mode?: ScrollCueMode; fog?: ScrollFogMode }>;
            if (customEvent.detail?.mode) setCueMode(customEvent.detail.mode);
            if (customEvent.detail?.fog) setFogMode(customEvent.detail.fog);
        };

        const handleDockUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ side?: "right" | "left" }>;
            if (customEvent.detail?.side) setDockSide(customEvent.detail.side);
        };

        window.addEventListener("scroll-cue-change", handleUpdate);
        window.addEventListener("dock-side-change", handleDockUpdate);
        return () => {
            window.removeEventListener("scroll-cue-change", handleUpdate);
            window.removeEventListener("dock-side-change", handleDockUpdate);
        };
    }, []);

    useEffect(() => {
        const checkScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;

            const isScrollable = maxScroll > 40;
            setHasMoreContent(isScrollable);
            setScrolled(currentScroll > 40);

            const pct = maxScroll > 0 ? Math.min(100, Math.round((currentScroll / maxScroll) * 100)) : 0;
            setScrollPercent(pct);
        };

        checkScroll();
        window.addEventListener("scroll", checkScroll, { passive: true });
        window.addEventListener("resize", checkScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    const handleScrollDown = () => {
        robustScrollBy(Math.round(window.innerHeight * 0.55));
    };

    const handleScrollTop = () => {
        robustScrollTo(0);
    };

    return (
        <>
            {/* Atmospheric Bottom Fog / Scrim */}
            {fogMode !== "none" && (
                <div
                    aria-hidden="true"
                    className={`fixed bottom-0 left-0 right-0 pointer-events-none z-15 transition-all duration-500 ${
                        fogMode === "subtle"
                            ? "h-28 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/40 to-transparent opacity-85"
                            : "h-44 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/70 to-transparent opacity-95"
                    }`}
                />
            )}

            {/* Pattern 1: Dynamic Floating Pill */}
            {cueMode === "pill" && (
                <aside
                    aria-label="Scroll prompt"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer transition-all duration-500 select-none ${
                        scrolled && hasMoreContent ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="px-3.5 py-1.5 rounded-full border border-current/15 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-md">
                        <span className="inline-block animate-bounce text-[10px]">↓</span>
                        <span>scroll for projects &amp; thoughts</span>
                    </div>
                </aside>
            )}

            {/* Pattern 2: Marginal Monospace Progress Tick (Opposite dock side to avoid covering) */}
            {cueMode === "tick" && (
                <aside
                    aria-label="Scroll index"
                    onClick={scrolled ? handleScrollTop : handleScrollDown}
                    className={`fixed bottom-6 z-40 cursor-pointer transition-all duration-300 select-none ${
                        dockSide === "right" ? "left-6 sm:left-10" : "right-6 sm:right-10"
                    }`}
                >
                    <div className="px-3 py-1.5 rounded border border-current/15 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-md">
                        <span className="font-semibold text-[var(--text-color)]">
                            [{scrollPercent}%]
                        </span>
                        <span>{scrolled ? "↑ top" : "↓ scroll"}</span>
                        <span className="text-[10px] opacity-60">
                            {scrolled ? "• read" : "• 3 sections"}
                        </span>
                    </div>
                </aside>
            )}

            {/* Pattern 3: Layout Peek Rule */}
            {cueMode === "peek" && (
                <aside
                    aria-label="Section fold cue"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer transition-all duration-500 select-none ${
                        scrolled && hasMoreContent ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="px-3 py-1 rounded bg-[var(--bg-color)]/90 border border-dashed border-current/25 backdrop-blur-sm text-[10.5px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-all flex items-center gap-2 shadow-sm">
                        <span className="opacity-50">┈┈┈</span>
                        <span className="text-[var(--text-color)]">more entries below fold</span>
                        <span className="text-[10px] animate-pulse">↓</span>
                        <span className="opacity-50">┈┈┈</span>
                    </div>
                </aside>
            )}

            {/* Pattern 4: Continuous Entrance Drift / Gentle Pulse */}
            {cueMode === "drift" && (
                <aside
                    aria-label="Continuous drift cue"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer transition-all duration-500 select-none ${
                        scrolled && hasMoreContent ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="relative px-3.5 py-1.5 rounded-full border border-current/20 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--text-color)] shadow-md flex items-center gap-2 animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>continue reading ↓</span>
                    </div>
                </aside>
            )}
        </>
    );
}
