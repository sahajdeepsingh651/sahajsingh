"use client";

import { useState, useEffect } from "react";

type BgOption = "default" | "candidate" | "original" | "none";
type SizeOption = "100% auto" | "cover" | "contain";
type PositionOption = "bottom center" | "center center" | "top center";

export default function BackgroundSwitcher() {
    const [bgOption, setBgOption] = useState<BgOption>("candidate");
    const [bgSize, setBgSize] = useState<SizeOption>("100% auto");
    const [bgPosition, setBgPosition] = useState<PositionOption>("bottom center");
    const [horizonEnabled, setHorizonEnabled] = useState<boolean>(true);
    const [frostedBoxEnabled, setFrostedBoxEnabled] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isDark, setIsDark] = useState<boolean>(false);

    // Watch for theme changes (dark/light)
    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    // Load saved preferences
    useEffect(() => {
        const savedBg = (localStorage.getItem("experiment_bg") as BgOption) || "candidate";
        const savedSize = (localStorage.getItem("experiment_bg_size") as SizeOption) || "100% auto";
        const savedPos = (localStorage.getItem("experiment_bg_pos") as PositionOption) || "bottom center";
        const savedHorizon = localStorage.getItem("horizon_foreground");
        const savedBox = localStorage.getItem("glass_frame_box");

        setBgOption(savedBg);
        setBgSize(savedSize);
        setBgPosition(savedPos);
        if (savedHorizon !== null) setHorizonEnabled(savedHorizon === "true");
        if (savedBox !== null) setFrostedBoxEnabled(savedBox === "true");
    }, []);

    // Apply background styles to body and sync with foreground horizon
    useEffect(() => {
        const body = document.body;
        if (!body) return;

        // Determine background image based on selection and theme
        if (bgOption === "none") {
            body.style.backgroundImage = "none";
        } else if (bgOption === "candidate") {
            body.style.backgroundImage = isDark
                ? 'url("/candidate_bg_dark.png")'
                : 'url("/candidate_bg.png")';
        } else if (bgOption === "original") {
            body.style.backgroundImage = isDark
                ? 'url("/real_write_mode.png")'
                : 'url("/real_read_mode.original.png")';
        } else {
            // Default: clear inline override so globals.css controls it (theme-dependent)
            body.style.backgroundImage = "";
        }

        body.style.backgroundSize = bgSize;
        body.style.backgroundPosition = bgPosition;

        localStorage.setItem("experiment_bg", bgOption);
        localStorage.setItem("experiment_bg_size", bgSize);
        localStorage.setItem("experiment_bg_pos", bgPosition);

        window.dispatchEvent(
            new CustomEvent("horizon-style-change", {
                detail: { size: bgSize, pos: bgPosition },
            })
        );
    }, [bgOption, bgSize, bgPosition, isDark]);

    const selectBg = (option: BgOption) => {
        setBgOption(option);
    };

    const toggleHorizon = (enabled: boolean) => {
        setHorizonEnabled(enabled);
        localStorage.setItem("horizon_foreground", String(enabled));
        window.dispatchEvent(new Event("horizon-toggle"));
    };

    const toggleFrostedBox = (enabled: boolean) => {
        setFrostedBoxEnabled(enabled);
        localStorage.setItem("glass_frame_box", String(enabled));
        window.dispatchEvent(new Event("glass-box-toggle"));
    };

    return (
        <aside
            aria-label="Background and horizon visual experiment switcher"
            className="fixed left-4 sm:left-6 bottom-6 z-50 font-mono text-xs text-[var(--text-muted)]"
        >
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-2 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg text-[11px] text-[var(--text-color)] hover:border-current/40 transition-colors flex items-center gap-2 cursor-pointer"
                    title="Open Visual Experiment Controls"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🌊 Horizon Foreground: {horizonEnabled ? "ON" : "OFF"}</span>
                    <span className="text-[var(--text-muted)]">[open]</span>
                </button>
            ) : (
                <div className="p-3.5 rounded border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl space-y-3 w-76 max-w-[calc(100vw-2rem)]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-current/10 pb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Horizon Foreground Mode
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                            title="Minimize to corner"
                        >
                            [− minimize]
                        </button>
                    </div>

                    {/* Horizon Depth Toggle */}
                    <div className="space-y-1.5 bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-[var(--text-color)]">
                                Horizon in Foreground:
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => toggleHorizon(true)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        horizonEnabled
                                            ? "bg-emerald-600 text-white font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    ON (Text behind)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleHorizon(false)}
                                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        !horizonEnabled
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    OFF
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                            Ocean waves &amp; lighthouse sit in foreground; text slips behind as you scroll.
                        </p>
                    </div>

                    {/* Frosted Glass Frame Toggle */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-[var(--text-muted)]">Frosted Card Box:</span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => toggleFrostedBox(false)}
                                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                    !frostedBoxEnabled
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                Borderless (Pure)
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleFrostedBox(true)}
                                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                    frostedBoxEnabled
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                Card Box
                            </button>
                        </div>
                    </div>

                    {/* Background Selection */}
                    <div className="space-y-1.5 pt-2 border-t border-current/10">
                        <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                            Background Art
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => selectBg("candidate")}
                                className={`px-2 py-1 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "candidate"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                ★ Candidate {isDark ? "(Night)" : "(Day)"}
                            </button>
                            <button
                                type="button"
                                onClick={() => selectBg("default")}
                                className={`px-2 py-1 rounded text-[11px] text-left border cursor-pointer transition-colors ${
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
                                className={`px-2 py-1 rounded text-[11px] text-left border cursor-pointer transition-colors ${
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
                                className={`px-2 py-1 rounded text-[11px] text-left border cursor-pointer transition-colors ${
                                    bgOption === "none"
                                        ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent"
                                        : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                }`}
                            >
                                None (Clean)
                            </button>
                        </div>
                    </div>

                    {/* Scaling & Placement */}
                    <div className="pt-2 border-t border-current/10 space-y-1.5">
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

                    {/* Status Readout */}
                    <div className="pt-1.5 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                        <span>
                            Depth: <strong className="text-emerald-500">{horizonEnabled ? "Front" : "Flat"}</strong>
                        </span>
                        <span>Theme: <strong className="text-[var(--text-color)]">{isDark ? "Cosmic (Dark)" : "Parchment"}</strong></span>
                    </div>
                </div>
            )}
        </aside>
    );
}
