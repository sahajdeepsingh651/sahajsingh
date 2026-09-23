"use client";

import { useState, useEffect } from "react";

type DarkBgOption = "original" | "candidate";
type BgSizing = "100% auto" | "cover";

export default function DarkBgTester() {
    const [selectedBg, setSelectedBg] = useState<DarkBgOption>("candidate");
    const [sizing, setSizing] = useState<BgSizing>("100% auto");
    const [showHorizon, setShowHorizon] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    useEffect(() => {
        const savedBg = (localStorage.getItem("test_dark_bg") as DarkBgOption) || "candidate";
        const savedSizing = (localStorage.getItem("test_dark_bg_sizing") as BgSizing) || "100% auto";
        const savedHorizon = localStorage.getItem("horizon_foreground");

        setSelectedBg(savedBg);
        setSizing(savedSizing);
        if (savedHorizon !== null) {
            setShowHorizon(savedHorizon === "true");
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const bgUrl =
            selectedBg === "candidate"
                ? 'url("/real_real_night_mode.png")'
                : 'url("/real_write_mode.png")';

        root.style.setProperty("--dark-bg-image", bgUrl);
        root.style.setProperty("--dark-bg-size", sizing);
        localStorage.setItem("test_dark_bg", selectedBg);
        localStorage.setItem("test_dark_bg_sizing", sizing);

        // Notify HorizonForeground if horizon toggle changes
        localStorage.setItem("horizon_foreground", String(showHorizon));
        window.dispatchEvent(new Event("horizon-toggle"));
    }, [selectedBg, sizing, showHorizon]);

    if (isCollapsed) {
        return (
            <aside
                aria-label="Dark mode background tester"
                className="fixed bottom-4 right-4 z-50 select-none print:hidden"
            >
                <button
                    type="button"
                    onClick={() => setIsCollapsed(false)}
                    className="px-3 py-1.5 rounded-full border border-current/20 bg-[var(--bg-color)]/90 backdrop-blur-md text-xs font-mono text-[var(--text-color)] shadow-lg hover:border-current/40 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Compare Night BG [{selectedBg}]</span>
                </button>
            </aside>
        );
    }

    return (
        <aside
            aria-label="Dark mode background tester panel"
            className="fixed bottom-4 right-4 z-50 select-none p-3.5 rounded-lg border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-2xl text-xs font-mono text-[var(--text-color)] max-w-xs space-y-3 print:hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                        Dark Mode BG Tester
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

            {/* Background Switcher Options */}
            <div className="space-y-1.5">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                    Select Artwork:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={() => setSelectedBg("candidate")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            selectedBg === "candidate"
                                ? "border-emerald-500 bg-emerald-500/15 font-semibold text-[var(--text-color)]"
                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/30"
                        }`}
                    >
                        <div className="text-[11px]">Candidate</div>
                        <div className="text-[9px] text-[var(--text-muted)] truncate">
                            real_real_night_mode
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedBg("original")}
                        className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            selectedBg === "original"
                                ? "border-emerald-500 bg-emerald-500/15 font-semibold text-[var(--text-color)]"
                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/30"
                        }`}
                    >
                        <div className="text-[11px]">Original</div>
                        <div className="text-[9px] text-[var(--text-muted)] truncate">
                            real_write_mode
                        </div>
                    </button>
                </div>
            </div>

            {/* Sizing Toggle */}
            <div className="space-y-1.5 pt-1 border-t border-current/10">
                <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[var(--text-muted)] uppercase tracking-wider">
                        Artwork Sizing:
                    </span>
                    <span className="text-[var(--text-color)]">{sizing}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                        type="button"
                        onClick={() => setSizing("100% auto")}
                        className={`py-1 px-2 rounded border text-center cursor-pointer transition-all ${
                            sizing === "100% auto"
                                ? "border-current bg-current/10 font-medium"
                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                        }`}
                    >
                        100% auto
                    </button>
                    <button
                        type="button"
                        onClick={() => setSizing("cover")}
                        className={`py-1 px-2 rounded border text-center cursor-pointer transition-all ${
                            sizing === "cover"
                                ? "border-current bg-current/10 font-medium"
                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                        }`}
                    >
                        Cover
                    </button>
                </div>
            </div>

            {/* Horizon Foreground Layer Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[11px]">
                <span className="text-[var(--text-muted)]">Ocean Waves Overlay:</span>
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
