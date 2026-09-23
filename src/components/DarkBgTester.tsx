"use client";

import { useState, useEffect } from "react";

type StarDensityOption = "clean" | "thinned" | "minimal" | "original";
type BgSizing = "100% auto" | "cover";

const STAR_OPTIONS: Record<
    StarDensityOption,
    { label: string; file: string; desc: string; count: string }
> = {
    clean: {
        label: "Calm Sky (Recommended)",
        file: "/real_write_mode.clean.png",
        desc: "837 stardust specks removed, 320 prominent stars kept",
        count: "320 stars (-72%)",
    },
    thinned: {
        label: "Subtle Thinning",
        file: "/real_write_mode.thinned.png",
        desc: "637 noisy stars removed, 520 stars kept",
        count: "520 stars (-45%)",
    },
    minimal: {
        label: "Minimal Constellations",
        file: "/real_write_mode.minimal.png",
        desc: "Only the primary focal constellations remain",
        count: "140 stars (-88%)",
    },
    original: {
        label: "Dense Original",
        file: "/real_write_mode.original.png",
        desc: "Unmodified dense stardust sky",
        count: "1,157 stars (100%)",
    },
};

export default function DarkBgTester() {
    const [density, setDensity] = useState<StarDensityOption>("clean");
    const [sizing, setSizing] = useState<BgSizing>("100% auto");
    const [showHorizon, setShowHorizon] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    useEffect(() => {
        const savedDensity = (localStorage.getItem("test_star_density") as StarDensityOption) || "clean";
        const savedSizing = (localStorage.getItem("test_dark_bg_sizing") as BgSizing) || "100% auto";
        const savedHorizon = localStorage.getItem("horizon_foreground");

        if (STAR_OPTIONS[savedDensity]) {
            setDensity(savedDensity);
        }
        setSizing(savedSizing);
        if (savedHorizon !== null) {
            setShowHorizon(savedHorizon === "true");
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const bgUrl = `url("${STAR_OPTIONS[density].file}")`;

        root.style.setProperty("--dark-bg-image", bgUrl);
        root.style.setProperty("--dark-bg-size", sizing);
        localStorage.setItem("test_star_density", density);
        localStorage.setItem("test_dark_bg_sizing", sizing);

        // Notify HorizonForeground if horizon toggle changes
        localStorage.setItem("horizon_foreground", String(showHorizon));
        window.dispatchEvent(new Event("horizon-toggle"));
    }, [density, sizing, showHorizon]);

    if (isCollapsed) {
        return (
            <aside
                aria-label="Star density comparison tool"
                className="fixed bottom-4 right-4 z-50 select-none print:hidden"
            >
                <button
                    type="button"
                    onClick={() => setIsCollapsed(false)}
                    className="px-3 py-1.5 rounded-full border border-current/20 bg-[var(--bg-color)]/90 backdrop-blur-md text-xs font-mono text-[var(--text-color)] shadow-lg hover:border-current/40 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Stars: [{density}]</span>
                </button>
            </aside>
        );
    }

    return (
        <aside
            aria-label="Star density comparison panel"
            className="fixed bottom-4 right-4 z-50 select-none p-3.5 rounded-lg border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-2xl text-xs font-mono text-[var(--text-color)] max-w-sm space-y-3 print:hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                        Night Sky Stardust Density
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsCollapsed(true)}
                    title="Minimize tester"
                    className="text-[var(--text-muted)] hover:text-[var(--text-color)] px-1 py-0.5 rounded cursor-pointer"
                >
                    [—]
                </button>
            </div>

            {/* Density Selector */}
            <div className="space-y-1.5">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                    Choose Star Variation:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                    {(Object.keys(STAR_OPTIONS) as StarDensityOption[]).map((key) => {
                        const opt = STAR_OPTIONS[key];
                        const isSelected = density === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setDensity(key)}
                                className={`p-2 rounded border text-left cursor-pointer transition-all ${
                                    isSelected
                                        ? "border-emerald-500 bg-emerald-500/15 font-semibold text-[var(--text-color)]"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/30"
                                }`}
                            >
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[11px]">{opt.label}</span>
                                    <span className="text-[10px] font-mono opacity-80">{opt.count}</span>
                                </div>
                                <div className="text-[9.5px] text-[var(--text-muted)] leading-tight pt-0.5">
                                    {opt.desc}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Ocean Waves Layer Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[11px]">
                <span className="text-[var(--text-muted)]">Ocean Waves Foreground:</span>
                <button
                    type="button"
                    onClick={() => setShowHorizon(!showHorizon)}
                    className={`px-2 py-0.5 rounded border text-[10.5px] cursor-pointer transition-colors ${
                        showHorizon
                            ? "border-emerald-500 text-emerald-400 font-medium"
                            : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                    }`}
                >
                    {showHorizon ? "Enabled" : "Disabled"}
                </button>
            </div>
        </aside>
    );
}
