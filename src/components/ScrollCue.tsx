"use client";

import { useEffect, useState } from "react";

export type ScrollCueMode = "pill" | "tick" | "peek" | "drift" | "none";
export type ScrollFogMode = "none" | "subtle" | "pronounced";

export default function ScrollCue() {
    const [scrolled, setScrolled] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [cueMode, setCueMode] = useState<ScrollCueMode>("pill");
    const [fogMode, setFogMode] = useState<ScrollFogMode>("none");

    useEffect(() => {
        const loadPreferences = () => {
            const savedMode = (localStorage.getItem("experiment_scroll_cue") as ScrollCueMode) || "pill";
            const savedFog = (localStorage.getItem("experiment_scroll_fog") as ScrollFogMode) || "none";
            setCueMode(savedMode);
            setFogMode(savedFog);
        };

        loadPreferences();

        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ mode?: ScrollCueMode; fog?: ScrollFogMode }>;
            if (customEvent.detail?.mode) setCueMode(customEvent.detail.mode);
            if (customEvent.detail?.fog) setFogMode(customEvent.detail.fog);
        };

        window.addEventListener("scroll-cue-change", handleUpdate);
        return () => window.removeEventListener("scroll-cue-change", handleUpdate);
    }, []);

    useEffect(() => {
        const checkScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const currentScroll = window.scrollY;

            const isScrollable = maxScroll > 60;
            setHasMoreContent(isScrollable);
            setScrolled(currentScroll > 50);

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
        window.scrollBy({ top: window.innerHeight * 0.55, behavior: "smooth" });
    };

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
            {hasMoreContent && cueMode === "pill" && (
                <aside
                    aria-label="Scroll prompt"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-25 cursor-pointer transition-all duration-500 select-none ${
                        scrolled ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="px-3.5 py-1.5 rounded-full border border-current/15 bg-[var(--bg-color)]/85 backdrop-blur-md text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-sm">
                        <span className="inline-block animate-bounce text-[10px]">↓</span>
                        <span>scroll for projects &amp; thoughts</span>
                    </div>
                </aside>
            )}

            {/* Pattern 2: Marginal Monospace Progress Tick */}
            {hasMoreContent && cueMode === "tick" && (
                <aside
                    aria-label="Scroll index"
                    onClick={scrolled ? handleScrollTop : handleScrollDown}
                    className="fixed bottom-6 right-6 sm:right-10 z-25 cursor-pointer transition-all duration-300 select-none"
                >
                    <div className="px-3 py-1.5 rounded border border-current/15 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-sm">
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
            {hasMoreContent && cueMode === "peek" && (
                <aside
                    aria-label="Section fold cue"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-25 cursor-pointer transition-all duration-500 select-none ${
                        scrolled ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="px-3 py-1 rounded bg-[var(--bg-color)]/90 border border-dashed border-current/25 backdrop-blur-sm text-[10.5px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-all flex items-center gap-2 shadow-xs">
                        <span className="opacity-50">┈┈┈</span>
                        <span className="text-[var(--text-color)]">more entries below fold</span>
                        <span className="text-[10px] animate-pulse">↓</span>
                        <span className="opacity-50">┈┈┈</span>
                    </div>
                </aside>
            )}

            {/* Pattern 4: Continuous Entrance Drift / Gentle Pulse */}
            {hasMoreContent && cueMode === "drift" && (
                <aside
                    aria-label="Continuous drift cue"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-25 cursor-pointer transition-all duration-500 select-none ${
                        scrolled ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
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
