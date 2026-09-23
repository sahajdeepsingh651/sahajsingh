"use client";

import { useState, useEffect, useRef } from "react";

type ActiveTab = "typography" | "art";
type BgOption = "default" | "candidate" | "original" | "none";
type SizeOption = "100% auto" | "cover" | "contain";
type PositionOption = "bottom center" | "center center" | "top center";
type EntryAlignMode = "left-flow" | "date-left" | "justified" | "tabular";

export default function BackgroundSwitcher() {
    // Tab state
    const [activeTab, setActiveTab] = useState<ActiveTab>("typography");
    const [isOpen, setIsOpen] = useState<boolean>(true);

    // Draggable position & docking state (defaults to right-aligned)
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dockSide, setDockSide] = useState<"right" | "left">("right");
    const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Typography & Alignment state
    const [fontSize, setFontSize] = useState<number>(15);
    const [entryGap, setEntryGap] = useState<number>(28);
    const [alignMode, setAlignMode] = useState<EntryAlignMode>("left-flow");

    // Art & Horizon state
    const [bgOption, setBgOption] = useState<BgOption>("candidate");
    const [bgSize, setBgSize] = useState<SizeOption>("100% auto");
    const [bgPosition, setBgPosition] = useState<PositionOption>("bottom center");
    const [horizonEnabled, setHorizonEnabled] = useState<boolean>(true);
    const [frostedBoxEnabled, setFrostedBoxEnabled] = useState<boolean>(false);
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
        const savedFontSize = localStorage.getItem("experiment_font_size");
        const savedEntryGap = localStorage.getItem("experiment_entry_gap");
        const savedAlign = localStorage.getItem("experiment_entry_align") as EntryAlignMode;
        const savedDockSide = (localStorage.getItem("experiment_dock_side") as "right" | "left") || "right";
        const savedDockPos = localStorage.getItem("experiment_dock_pos");

        const savedBg = (localStorage.getItem("experiment_bg") as BgOption) || "candidate";
        const savedSize = (localStorage.getItem("experiment_bg_size") as SizeOption) || "100% auto";
        const savedPos = (localStorage.getItem("experiment_bg_pos") as PositionOption) || "bottom center";
        const savedHorizon = localStorage.getItem("horizon_foreground");
        const savedBox = localStorage.getItem("glass_frame_box");

        if (savedFontSize) setFontSize(Number(savedFontSize));
        if (savedEntryGap) setEntryGap(Number(savedEntryGap));
        if (savedAlign) setAlignMode(savedAlign);
        setDockSide(savedDockSide);

        if (savedDockPos) {
            try {
                const parsed = JSON.parse(savedDockPos);
                if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
                    setPos(parsed);
                }
            } catch {
                // Ignore parse errors
            }
        }

        setBgOption(savedBg);
        setBgSize(savedSize);
        setBgPosition(savedPos);
        if (savedHorizon !== null) setHorizonEnabled(savedHorizon === "true");
        if (savedBox !== null) setFrostedBoxEnabled(savedBox === "true");
    }, []);

    // Apply typography & spacing variables to documentElement
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--base-font-size", `${fontSize}px`);
        root.style.setProperty("--entry-gap", `${entryGap}px`);
        root.setAttribute("data-entry-align", alignMode);

        localStorage.setItem("experiment_font_size", String(fontSize));
        localStorage.setItem("experiment_entry_gap", String(entryGap));
        localStorage.setItem("experiment_entry_align", alignMode);
    }, [fontSize, entryGap, alignMode]);

    // Apply background styles to body and sync with foreground horizon
    useEffect(() => {
        const body = document.body;
        if (!body) return;

        // When in dark mode, preserve original cosmic night mode art completely untouched
        if (isDark) {
            body.style.backgroundImage = "";
        } else {
            // Light mode background selection
            if (bgOption === "none") {
                body.style.backgroundImage = "none";
            } else if (bgOption === "candidate") {
                body.style.backgroundImage = 'url("/candidate_bg.png")';
            } else if (bgOption === "original") {
                body.style.backgroundImage = 'url("/real_read_mode.original.png")';
            } else {
                body.style.backgroundImage = "";
            }
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

    // Pointer-based dragging handlers
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button, input, a, select")) return;
        const panel = panelRef.current;
        if (!panel) return;

        const rect = panel.getBoundingClientRect();
        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initX: rect.left,
            initY: rect.top,
        };
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !dragStartRef.current || !panelRef.current) return;
        const dx = e.clientX - dragStartRef.current.startX;
        const dy = e.clientY - dragStartRef.current.startY;

        const panel = panelRef.current;
        const w = panel.offsetWidth;
        const h = panel.offsetHeight;

        const maxX = Math.max(0, window.innerWidth - w - 8);
        const maxY = Math.max(0, window.innerHeight - h - 8);

        const newX = Math.min(maxX, Math.max(8, dragStartRef.current.initX + dx));
        const newY = Math.min(maxY, Math.max(8, dragStartRef.current.initY + dy));

        setPos({ x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsDragging(false);
            dragStartRef.current = null;
            if (pos) {
                localStorage.setItem("experiment_dock_pos", JSON.stringify(pos));
            }
        }
    };

    const dockTo = (side: "right" | "left") => {
        setDockSide(side);
        setPos(null);
        localStorage.removeItem("experiment_dock_pos");
        localStorage.setItem("experiment_dock_side", side);
    };

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

    const containerClasses =
        pos !== null
            ? "fixed z-50 font-mono text-xs text-[var(--text-muted)]"
            : dockSide === "right"
                ? "fixed right-3 sm:right-6 bottom-4 sm:bottom-6 z-50 font-mono text-xs text-[var(--text-muted)]"
                : "fixed left-3 sm:left-6 bottom-4 sm:bottom-6 z-50 font-mono text-xs text-[var(--text-muted)]";

    const containerStyle =
        pos !== null ? { left: `${pos.x}px`, top: `${pos.y}px` } : undefined;

    return (
        <aside
            aria-label="Typography, layout spacing, and visual art experiment studio"
            className={containerClasses}
            style={containerStyle}
        >
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-3.5 py-2.5 rounded-lg border border-current/25 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-xl text-[11px] text-[var(--text-color)] hover:border-current/40 transition-all flex items-center gap-2.5 cursor-pointer"
                    title="Open Typography & Design Studio (Right-Aligned / Draggable)"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                        🔤 <strong>{fontSize}px</strong>
                    </span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span>
                        ↔ <strong>{entryGap}px</strong>
                    </span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="capitalize">{alignMode.replace("-", " ")}</span>
                    <span className="text-[var(--text-muted)] ml-1">[open]</span>
                </button>
            ) : (
                <div
                    ref={panelRef}
                    className="p-4 rounded-xl border border-current/20 bg-[var(--bg-color)]/95 backdrop-blur-md shadow-2xl space-y-3.5 w-[340px] sm:w-[390px] max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto"
                >
                    {/* Draggable Header Bar */}
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        className="flex items-center justify-between border-b border-current/10 pb-2.5 cursor-grab active:cursor-grabbing select-none"
                        title="Click and drag from here to position the studio anywhere on screen"
                    >
                        <span className="text-[12px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="opacity-60 text-[10px] tracking-normal cursor-grab">⠿</span> Studio Controller
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                            <button
                                type="button"
                                onClick={() => dockTo(dockSide === "right" ? "left" : "right")}
                                className="text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                                title={`Dock to ${dockSide === "right" ? "left" : "right"}`}
                            >
                                {dockSide === "right" ? "⇤ dock left" : "⇥ dock right"}
                            </button>
                            <span className="opacity-30">|</span>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline cursor-pointer"
                                title="Minimize to corner"
                            >
                                [− minimize]
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="grid grid-cols-2 gap-1 p-0.5 rounded-md bg-current/5 border border-current/10 text-[11px]">
                        <button
                            type="button"
                            onClick={() => setActiveTab("typography")}
                            className={`py-1 rounded font-medium cursor-pointer transition-colors ${
                                activeTab === "typography"
                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-sm"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)]"
                            }`}
                        >
                            🔤 Text Size &amp; Distance
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("art")}
                            className={`py-1 rounded font-medium cursor-pointer transition-colors ${
                                activeTab === "art"
                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-sm"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)]"
                            }`}
                        >
                            🌊 Horizon &amp; Art
                        </button>
                    </div>

                    {/* TAB 1: TYPOGRAPHY & SPACING */}
                    {activeTab === "typography" && (
                        <div className="space-y-4 pt-1">
                            {/* 1. Global Font Size Slider & Presets */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)]">
                                        Site-Wide Text Size:
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {fontSize}px ({Math.round((fontSize / 15) * 100)}%)
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={13}
                                    max={22}
                                    step={1}
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    {[13, 14, 15, 16, 17, 18, 20].map((sz) => (
                                        <button
                                            key={sz}
                                            type="button"
                                            onClick={() => setFontSize(sz)}
                                            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                                fontSize === sz
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                            }`}
                                        >
                                            {sz}px {sz === 15 ? "(std)" : sz === 17 ? "(large)" : ""}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFontSize(15)}
                                        className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                    >
                                        [reset 15px]
                                    </button>
                                </div>
                            </div>

                            {/* 2. Alignment Mode (Left-Align Requested) */}
                            <div className="space-y-1.5 pt-2 border-t border-current/10">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)]">
                                        Essay Line Alignment:
                                    </span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize">
                                        {alignMode.replace("-", " ")}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setAlignMode("left-flow")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "left-flow"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        ★ Left-Aligned
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Title [status] ↔ Date
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlignMode("date-left")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "date-left"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Date on Left
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Date ↔ Title [status]
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlignMode("justified")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "justified"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Justified (Baseline)
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Title [left] Date [far right]
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlignMode("tabular")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "tabular"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Tabular Column
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Fixed width date column
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* 3. Distance / Gap Slider (Between [in progress] and Date) */}
                            <div className="space-y-2 pt-2 border-t border-current/10">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)]">
                                        Distance: [status] ↔ Date:
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {entryGap}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={8}
                                    max={84}
                                    step={2}
                                    value={entryGap}
                                    onChange={(e) => setEntryGap(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    {[12, 20, 28, 40, 56, 72].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setEntryGap(g)}
                                            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                                entryGap === g
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                            }`}
                                        >
                                            {g}px {g === 28 ? "(bal)" : g === 40 ? "(wide)" : ""}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setEntryGap(28)}
                                        className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                    >
                                        [reset 28px]
                                    </button>
                                </div>
                            </div>

                            {/* 4. Live Sandbox Test Preview */}
                            <div className="pt-2 border-t border-current/10 space-y-1.5">
                                <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                    Live Sandbox Preview (Simulated Item)
                                </span>
                                <div className="p-3 rounded-lg border border-current/15 bg-current/5 space-y-2">
                                    <div
                                        className="entry-row font-serif"
                                        style={{
                                            columnGap: `${entryGap}px`,
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "baseline",
                                            justifyContent:
                                                alignMode === "justified"
                                                    ? "space-between"
                                                    : "flex-start",
                                        }}
                                    >
                                        <div
                                            className="inline-flex items-baseline gap-2 font-serif text-[var(--text-color)] font-medium"
                                            style={{
                                                order: alignMode === "date-left" || alignMode === "tabular" ? 1 : 0,
                                            }}
                                        >
                                            <span>
                                                On Knowledge Engines, Distributed Consensus, and First Principles
                                            </span>
                                            <span className="text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                                                [in progress]
                                            </span>
                                        </div>

                                        <span
                                            className="text-[12px] font-mono text-[var(--text-color)] shrink-0"
                                            style={{
                                                order: alignMode === "date-left" || alignMode === "tabular" ? 0 : 1,
                                                minWidth: alignMode === "tabular" ? "95px" : "auto",
                                            }}
                                        >
                                            2026-09-21
                                        </span>
                                    </div>

                                    {/* Visual distance ruler indicator */}
                                    {alignMode !== "justified" && (
                                        <div className="pt-1.5 flex items-center justify-between text-[9px] text-emerald-600 dark:text-emerald-400 font-mono border-t border-current/10">
                                            <span>← Title [status]</span>
                                            <span className="font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                ↔ {entryGap}px gap
                                            </span>
                                            <span>Date →</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                                    Tip: Grab the header bar above (⠿) to freely drag this window anywhere on your screen!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: HORIZON & BACKGROUND ART */}
                    {activeTab === "art" && (
                        <div className="space-y-3 pt-1">
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
                                    Ocean waves &amp; shoreline sit in foreground; text slips behind as you scroll.
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
                                    Background Art {isDark ? "(Original Night Locked)" : "(Daytime Testing)"}
                                </span>
                                {isDark ? (
                                    <div className="p-2 rounded bg-current/5 border border-current/10 text-[10px] text-[var(--text-muted)] leading-relaxed">
                                        🌌 Night mode uses your original cosmic artwork (<code className="text-[var(--text-color)]">/real_write_mode.png</code>). Switch to light mode to test daytime backgrounds.
                                    </div>
                                ) : (
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
                                            ★ Candidate Art
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
                                )}
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
                        </div>
                    )}

                    {/* Footer Status Readout */}
                    <div className="pt-2 border-t border-current/10 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                        <span>
                            Text: <strong className="text-[var(--text-color)]">{fontSize}px</strong> • Gap:{" "}
                            <strong className="text-[var(--text-color)]">{entryGap}px</strong>
                        </span>
                        <span>
                            Theme:{" "}
                            <strong className="text-[var(--text-color)]">
                                {isDark ? "Cosmic (Dark)" : "Parchment"}
                            </strong>
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}
