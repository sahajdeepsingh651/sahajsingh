"use client";

import { useEffect, useState } from "react";

export type ScrollCueMode =
    | "hairline"
    | "celestial"
    | "catchword"
    | "ledger"
    | "perforation"
    | "cliff"
    | "pill"
    | "none";

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

/* Faceted 4-point Astrolabe / Celestial Star from blo.png & dark_mode_blog.png */
function CelestialStar({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 36 36"
            className={className || "w-7 h-7 sm:w-8 sm:h-8"}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* North Point */}
            <polygon points="18,2 18,18 10,18" fill="currentColor" opacity="0.9" />
            <polygon points="18,2 26,18 18,18" fill="currentColor" opacity="0.45" />

            {/* South Point */}
            <polygon points="18,34 18,18 26,18" fill="currentColor" opacity="0.9" />
            <polygon points="18,34 10,18 18,18" fill="currentColor" opacity="0.45" />

            {/* East Point */}
            <polygon points="34,18 18,18 18,10" fill="currentColor" opacity="0.8" />
            <polygon points="34,18 18,26 18,18" fill="currentColor" opacity="0.35" />

            {/* West Point */}
            <polygon points="2,18 18,18 18,26" fill="currentColor" opacity="0.8" />
            <polygon points="2,18 18,10 18,18" fill="currentColor" opacity="0.35" />

            {/* Center diamond pivot */}
            <polygon points="18,15 21,18 18,21 15,18" fill="var(--bg-color)" />
        </svg>
    );
}

export default function ScrollCue() {
    const [scrolled, setScrolled] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(true);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [cueMode, setCueMode] = useState<ScrollCueMode>("hairline");
    const [fogMode, setFogMode] = useState<ScrollFogMode>("none");
    const [dockSide, setDockSide] = useState<"right" | "left">("right");

    useEffect(() => {
        const loadPreferences = () => {
            const rawMode = localStorage.getItem("experiment_scroll_cue");
            // Map previous test values
            let savedMode: ScrollCueMode = "hairline";
            if (rawMode === "tick") savedMode = "ledger";
            else if (rawMode === "peek") savedMode = "perforation";
            else if (rawMode === "drift") savedMode = "celestial";
            else if (
                rawMode === "hairline" ||
                rawMode === "celestial" ||
                rawMode === "catchword" ||
                rawMode === "ledger" ||
                rawMode === "perforation" ||
                rawMode === "cliff" ||
                rawMode === "pill" ||
                rawMode === "none"
            ) {
                savedMode = rawMode as ScrollCueMode;
            }

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

    const handleScrollToNext = () => {
        const headings = document.querySelectorAll(".section-heading");
        let target: Element | null = null;
        headings.forEach((h) => {
            if (h.textContent?.toLowerCase().includes("thoughts")) target = h;
        });
        if (!target && headings.length > 0) {
            target = headings[headings.length - 1];
        }
        if (target) {
            (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            handleScrollDown();
        }
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

            {/* OPTION 3: 1px Silent Graphite Hairline Reading Rule */}
            {cueMode === "hairline" && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-current/5"
                >
                    <div
                        className="h-full bg-[var(--heading-color)] opacity-70 transition-[transform] duration-75 ease-out origin-left will-change-transform"
                        style={{
                            transform: `scaleX(${scrollPercent / 100})`,
                        }}
                    />
                </div>
            )}

            {/* METHOD 1: Celestial Astrolabe Star (blo.png & dark_mode_blog.png mockup) */}
            {cueMode === "celestial" && (
                <aside
                    aria-label="Celestial navigation star"
                    onClick={scrolled ? handleScrollTop : handleScrollDown}
                    className={`fixed bottom-6 sm:bottom-8 z-40 cursor-pointer select-none transition-all duration-300 group ${
                        dockSide === "right" ? "left-6 sm:left-12" : "right-6 sm:right-12"
                    }`}
                    title={scrolled ? "Return to top (zenith)" : "Scroll to descend into logs"}
                >
                    <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--bg-color)]/80 hover:bg-[var(--bg-color)] border border-current/15 hover:border-current/35 shadow-md backdrop-blur-md text-[var(--heading-color)] transition-all">
                        <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <CelestialStar className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500" />
                        </div>
                        <span className="font-mono text-[10.5px] pr-2 text-[var(--text-muted)] group-hover:text-[var(--text-color)] transition-colors">
                            {scrolled ? "[ ↑ zenith ]" : "[ ✦ descend ]"}
                        </span>
                    </div>
                </aside>
            )}

            {/* METHOD 2: Historical Renaissance Catchword */}
            {cueMode === "catchword" && (
                <aside
                    aria-label="Historical catchword cue"
                    onClick={handleScrollToNext}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer select-none transition-all duration-500 ${
                        scrolled && hasMoreContent ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                    title="Read next section"
                >
                    <div className="px-3.5 py-1.5 rounded-full border border-current/15 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11.5px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-md">
                        <span className="font-mono text-[10px] opacity-60">[</span>
                        <span className="font-serif italic">next: recent thoughts</span>
                        <span className="font-mono text-xs">→</span>
                        <span className="font-mono opacity-60">]</span>
                    </div>
                </aside>
            )}

            {/* METHOD 3: Marginal Field Ledger / Progress Folio */}
            {cueMode === "ledger" && (
                <aside
                    aria-label="Field ledger index"
                    onClick={scrolled ? handleScrollTop : handleScrollDown}
                    className={`fixed bottom-6 z-40 cursor-pointer select-none transition-all duration-300 ${
                        dockSide === "right" ? "left-6 sm:left-10" : "right-6 sm:right-10"
                    }`}
                >
                    <div className="px-3 py-1.5 rounded border border-current/15 bg-[var(--bg-color)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/35 transition-all flex items-center gap-2 shadow-md">
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            [ 20°N • fol. {scrolled ? "03/03" : "01/03"} ]
                        </span>
                        <span>{scrolled ? "↑ top" : `${scrollPercent}% ↓`}</span>
                    </div>
                </aside>
            )}

            {/* METHOD 4: Editorial Dashed Perforation Boundary */}
            {cueMode === "perforation" && (
                <aside
                    aria-label="Editorial perforation divider"
                    onClick={handleScrollDown}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer select-none transition-all duration-500 ${
                        scrolled && hasMoreContent ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    }`}
                >
                    <div className="px-3.5 py-1 rounded bg-[var(--bg-color)]/90 border border-dashed border-current/25 backdrop-blur-sm text-[10.5px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-all flex items-center gap-2 shadow-sm">
                        <span className="opacity-40">┈┈┈┈┈</span>
                        <span className="font-serif italic text-[11.5px] text-[var(--text-color)]">§ inquiries continue below fold</span>
                        <span className="text-[10px] animate-pulse">↓</span>
                        <span className="opacity-40">┈┈┈┈┈</span>
                    </div>
                </aside>
            )}

            {/* METHOD 5: Visual Cliff Layout Cue */}
            {cueMode === "cliff" && (
                <aside
                    aria-label="Visual cliff cue"
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none opacity-60 text-[9.5px] font-mono text-[var(--text-muted)]"
                >
                    <span>[ visual cliff: layout fold cuts section header naturally ]</span>
                </aside>
            )}

            {/* METHOD 6: Dynamic Floating Pill */}
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
        </>
    );
}
