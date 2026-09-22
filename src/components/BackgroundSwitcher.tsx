"use client";

import { useState, useEffect } from "react";

type BgOption = "default" | "candidate" | "original" | "none";
type SizeOption = "100% auto" | "cover" | "contain";
type PositionOption = "bottom center" | "center center" | "top center";

export default function BackgroundSwitcher() {
    const [bgOption, setBgOption] = useState<BgOption>("candidate");
    const [bgSize, setBgSize] = useState<SizeOption>("100% auto");
    const [bgPosition, setBgPosition] = useState<PositionOption>("bottom center");
    const [isOpen, setIsOpen] = useState<boolean>(true);

    // Apply background styles to body
    useEffect(() => {
        const savedBg = (localStorage.getItem("experiment_bg") as BgOption) || "candidate";
        const savedSize = (localStorage.getItem("experiment_bg_size") as SizeOption) || "100% auto";
        const savedPos = (localStorage.getItem("experiment_bg_pos") as PositionOption) || "bottom center";

        setBgOption(savedBg);
        setBgSize(savedSize);
        setBgPosition(savedPos);
    }, []);

    useEffect(() => {
        const body = document.body;
        if (!body) return;

        // Determine background image based on selection
        if (bgOption === "none") {
            body.style.backgroundImage = "none";
        } else if (bgOption === "candidate") {
            body.style.backgroundImage = 'url("/candidate_bg.png")';
        } else if (bgOption === "original") {
            body.style.backgroundImage = 'url("/real_read_mode.original.png")';
        } else {
            // Default: clear inline override so globals.css controls it (theme-dependent)
            body.style.backgroundImage = "";
        }

        body.style.backgroundSize = bgSize;
        body.style.backgroundPosition = bgPosition;

        localStorage.setItem("experiment_bg", bgOption);
        localStorage.setItem("experiment_bg_size", bgSize);
        localStorage.setItem("experiment_bg_pos", bgPosition);
    }, [bgOption, bgSize, bgPosition]);

    const selectBg = (option: BgOption) => {
        setBgOption(option);
    };

    return (
        <aside
            aria-label="Background art switcher"
            className="fixed left-4 sm:left-6 bottom-6 z-50 font-mono text-xs text-[var(--text-muted)]"
        >
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-2 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                    title="Open Background Art Switcher"
                >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>🎨 Art: {bgOption}</span>
                    <span className="text-[var(--text-muted)]">[open]</span>
                </button>
            ) : (
                <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-72 max-w-[calc(100vw-2rem)]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-current/10 pb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Background Art Switcher
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                            title="Minimize switcher to bottom corner"
                        >
                            [− minimize]
                        </button>
                    </div>

                    {/* Background Selection */}
                    <div className="space-y-1.5">
                        <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                            Illustration Source
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => selectBg("candidate")}
                                className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "candidate"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                ★ New Candidate
                            </button>
                            <button
                                type="button"
                                onClick={() => selectBg("default")}
                                className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "default"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                Default (Theme)
                            </button>
                            <button
                                type="button"
                                onClick={() => selectBg("original")}
                                className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "original"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                Original Read
                            </button>
                            <button
                                type="button"
                                onClick={() => selectBg("none")}
                                className={`px-2 py-1.5 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "none"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                None (Clean)
                            </button>
                        </div>
                    </div>

                    {/* Scaling & Placement Tuning */}
                    <div className="pt-2 border-t border-current/10 space-y-2">
                        {/* Size */}
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)]">Size:</span>
                            <div className="flex items-center gap-1">
                                {(["100% auto", "cover", "contain"] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setBgSize(s)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                            bgSize === s
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                        }`}
                                    >
                                        {s === "100% auto" ? "100% width" : s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Position */}
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)]">Position:</span>
                            <div className="flex items-center gap-1">
                                {(["bottom center", "center center", "top center"] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setBgPosition(p)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                            bgPosition === p
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                        }`}
                                    >
                                        {p.split(" ")[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                        <span>Active: <strong className="text-[var(--text-color)]">{bgOption}</strong></span>
                        <span className="text-amber-600 dark:text-amber-400">Live Preview</span>
                    </div>
                </div>
            )}
        </aside>
    );
}
