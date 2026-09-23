"use client";

import { useState, useEffect, useRef } from "react";

type ActiveTab = "typography" | "art";
type BgOption = "default" | "candidate" | "original" | "none";
type SizeOption = "100% auto" | "cover" | "contain";
type PositionOption = "bottom center" | "center center" | "top center";
type EntryAlignMode = "left-flow" | "date-left" | "stacked" | "tabular" | "justified";

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

    // Typography, Spacing, Layout & Width state
    const [fontSize, setFontSize] = useState<number>(15);
    const [entryGap, setEntryGap] = useState<number>(28);
    const [contentWidth, setContentWidth] = useState<number>(860);
    const [alignMode, setAlignMode] = useState<EntryAlignMode>("justified");
    const [pageAlign, setPageAlign] = useState<"left" | "center">("left");
    const [pageLeftOffset, setPageLeftOffset] = useState<number>(48);
    const [navDistance, setNavDistance] = useState<number>(36);
    const [navPlacement, setNavPlacement] = useState<"after-border" | "inside-box" | "edge">("after-border");

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
        const savedContentWidth = localStorage.getItem("experiment_content_width");
        const savedAlign = localStorage.getItem("experiment_entry_align") as EntryAlignMode;
        const savedPageAlign = localStorage.getItem("experiment_page_align") as "left" | "center";
        const savedPageLeftOffset = localStorage.getItem("experiment_page_left_offset");
        const savedNavDistance = localStorage.getItem("experiment_nav_distance");
        const savedNavPlacement = localStorage.getItem("experiment_nav_placement") as "after-border" | "inside-box" | "edge";
        const savedDockSide = (localStorage.getItem("experiment_dock_side") as "right" | "left") || "right";
        const savedDockPos = localStorage.getItem("experiment_dock_pos");

        const savedBg = (localStorage.getItem("experiment_bg") as BgOption) || "candidate";
        const savedSize = (localStorage.getItem("experiment_bg_size") as SizeOption) || "100% auto";
        const savedPos = (localStorage.getItem("experiment_bg_pos") as PositionOption) || "bottom center";
        const savedHorizon = localStorage.getItem("horizon_foreground");
        const savedBox = localStorage.getItem("glass_frame_box");

        if (savedFontSize) setFontSize(Number(savedFontSize));
        if (savedEntryGap) setEntryGap(Number(savedEntryGap));
        if (savedContentWidth) {
            setContentWidth(Number(savedContentWidth));
        } else {
            setContentWidth(860);
        }
        if (savedAlign) {
            setAlignMode(savedAlign);
        } else {
            setAlignMode("justified");
        }
        if (savedPageAlign) {
            setPageAlign(savedPageAlign);
        } else {
            setPageAlign("left");
        }
        if (savedPageLeftOffset) setPageLeftOffset(Number(savedPageLeftOffset));
        if (savedNavDistance) setNavDistance(Number(savedNavDistance));
        if (savedNavPlacement) setNavPlacement(savedNavPlacement);
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

    // Apply typography, layout, spacing & section width variables to documentElement
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--base-font-size", `${fontSize}px`);
        root.style.setProperty("--entry-gap", `${entryGap}px`);
        root.style.setProperty("--content-width", `${contentWidth}px`);
        root.style.setProperty("--page-left-offset", `${pageLeftOffset}px`);
        root.style.setProperty("--nav-distance", `${navDistance}px`);
        root.setAttribute("data-entry-align", alignMode);
        root.setAttribute("data-page-align", pageAlign);
        root.setAttribute("data-nav-placement", navPlacement);

        localStorage.setItem("experiment_font_size", String(fontSize));
        localStorage.setItem("experiment_entry_gap", String(entryGap));
        localStorage.setItem("experiment_content_width", String(contentWidth));
        localStorage.setItem("experiment_entry_align", alignMode);
        localStorage.setItem("experiment_page_align", pageAlign);
        localStorage.setItem("experiment_page_left_offset", String(pageLeftOffset));
        localStorage.setItem("experiment_nav_distance", String(navDistance));
        localStorage.setItem("experiment_nav_placement", navPlacement);
    }, [fontSize, entryGap, contentWidth, alignMode, pageAlign, pageLeftOffset, navDistance, navPlacement]);

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

                    {/* TAB 1: TYPOGRAPHY, POSITIONING & SPACING */}
                    {activeTab === "typography" && (
                        <div className="space-y-4 pt-1">
                            {/* 1. Page Canvas Positioning (Left-Anchored vs. Centered) */}
                            <div className="space-y-2 p-2.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Page Layout Alignment:
                                    </span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                                        {pageAlign === "left" ? "Left-Anchored" : "Centered (mx-auto)"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setPageAlign("left")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            pageAlign === "left"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        ★ Left-Anchored
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Field notebook / Gwern style
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPageAlign("center")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            pageAlign === "center"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Centered Canvas
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Standard mx-auto
                                        </span>
                                    </button>
                                </div>

                                {pageAlign === "left" && (
                                    <div className="space-y-1.5 pt-2 border-t border-current/10">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-[var(--text-muted)] font-medium">
                                                Left Screen Margin (&ldquo;Sahaj Singh&rdquo;):
                                            </span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {pageLeftOffset}px
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={16}
                                            max={320}
                                            step={4}
                                            value={pageLeftOffset}
                                            onChange={(e) => setPageLeftOffset(Number(e.target.value))}
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                            {[16, 32, 48, 80, 120, 180, 240].map((o) => (
                                                <button
                                                    key={o}
                                                    type="button"
                                                    onClick={() => setPageLeftOffset(o)}
                                                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                                        pageLeftOffset === o
                                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                            : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                                    }`}
                                                >
                                                    {o}px {o === 48 ? "(bal)" : o === 80 ? "(gwern)" : ""}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setPageLeftOffset(48)}
                                                className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                            >
                                                [reset 48px]
                                            </button>
                                        </div>
                                        <p className="text-[9.5px] text-[var(--text-muted)] leading-tight pt-0.5">
                                            Shifts &ldquo;Sahaj Singh&rdquo;, the header, and all content closer to or further from the left window edge!
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 1B. Navigation Positioning & Distance */}
                            <div className="space-y-2.5 p-2.5 rounded-lg border border-sky-500/25 bg-sky-500/5">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                        Navigation Alignment &amp; Placement:
                                    </span>
                                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                                        {navPlacement === "after-border"
                                            ? `After Border (+${navDistance}px)`
                                            : navPlacement === "edge"
                                                ? "Edge-to-Edge (Right)"
                                                : `Inside Box (${navDistance}px)`}
                                    </span>
                                </div>

                                {/* Placement Mode Selector */}
                                <div className="grid grid-cols-3 gap-1 text-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setNavPlacement("after-border")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            navPlacement === "after-border"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        ★ After Border
                                        <span className="block text-[8.5px] opacity-75 mt-0.5">
                                            After &ldquo;view all [essays] →&rdquo;
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNavPlacement("inside-box")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            navPlacement === "inside-box"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Inside Box
                                        <span className="block text-[8.5px] opacity-75 mt-0.5">
                                            Inline with Sahaj Singh
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNavPlacement("edge")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            navPlacement === "edge"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Pinned to Edge
                                        <span className="block text-[8.5px] opacity-75 mt-0.5">
                                            Right edge of box
                                        </span>
                                    </button>
                                </div>

                                {navPlacement === "after-border" && (
                                    <div className="space-y-1.5 pt-1.5 border-t border-current/10">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-[var(--text-muted)] font-medium">
                                                Gap after &ldquo;view all [essays] →&rdquo; border:
                                            </span>
                                            <span className="font-bold text-sky-600 dark:text-sky-400">
                                                {navDistance}px
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={8}
                                            max={160}
                                            step={4}
                                            value={navDistance}
                                            onChange={(e) => setNavDistance(Number(e.target.value))}
                                            className="w-full accent-sky-500 cursor-pointer"
                                        />
                                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                            {[16, 24, 32, 36, 48, 64, 80, 100].map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => setNavDistance(d)}
                                                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                                        navDistance === d
                                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                            : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                                    }`}
                                                >
                                                    {d}px {d === 36 ? "(mockup)" : ""}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setNavDistance(36)}
                                                className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                            >
                                                [reset 36px]
                                            </button>
                                        </div>
                                        <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-[9.5px] leading-tight space-y-0.5">
                                            <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-semibold">
                                                <span>✓ Mode: Began After Border</span>
                                                <span>Starts at ~{contentWidth + navDistance}px</span>
                                            </div>
                                            <p className="text-[var(--text-muted)]">
                                                Content box ends at {contentWidth}px (right edge of &ldquo;view all [essays] →&rdquo;). Navigation links begin {navDistance}px immediately after it!
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {navPlacement === "inside-box" && (
                                    <div className="space-y-1.5 pt-1.5 border-t border-current/10">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-[var(--text-muted)] font-medium">
                                                Gap from &ldquo;Sahaj Singh&rdquo;:
                                            </span>
                                            <span className="font-bold text-sky-600 dark:text-sky-400">
                                                {navDistance}px
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={16}
                                            max={400}
                                            step={4}
                                            value={navDistance}
                                            onChange={(e) => setNavDistance(Number(e.target.value))}
                                            className="w-full accent-sky-500 cursor-pointer"
                                        />
                                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                            {[16, 24, 36, 48, 64, 96, 140, 200].map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => setNavDistance(d)}
                                                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                                        navDistance === d
                                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                            : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                                    }`}
                                                >
                                                    {d}px
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setNavDistance(48)}
                                                className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                            >
                                                [reset 48px]
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Global Font Size Slider & Presets */}
                            <div className="space-y-2 pt-2 border-t border-current/10">
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

                            {/* 3. Section Width / Stretch Slider */}
                            <div className="space-y-2 pt-2 border-t border-current/10">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)]">
                                        Content Box Width (Stretch):
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {contentWidth}px {contentWidth > 672 ? `(+${contentWidth - 672}px)` : "(std 2xl)"}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={600}
                                    max={1024}
                                    step={10}
                                    value={contentWidth}
                                    onChange={(e) => setContentWidth(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    {[672, 768, 840, 896, 960, 1024].map((w) => (
                                        <button
                                            key={w}
                                            type="button"
                                            onClick={() => setContentWidth(w)}
                                            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                                contentWidth === w
                                                    ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                                    : "border border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                            }`}
                                        >
                                            {w}px {w === 672 ? "(2xl)" : w === 768 ? "(3xl)" : w === 896 ? "(4xl)" : ""}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setContentWidth(860)}
                                        className="text-[10px] text-[var(--text-muted)] hover:underline ml-auto cursor-pointer"
                                    >
                                        [reset 860px]
                                    </button>
                                </div>
                                <p className="text-[9.5px] text-[var(--text-muted)] leading-tight">
                                    Stretches &lt;div className=&quot;space-y-12 content-box&quot;&gt; live across the screen!
                                </p>
                            </div>

                            {/* 4. Alignment Mode */}
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
                                        onClick={() => setAlignMode("justified")}
                                        className={`col-span-2 p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "justified"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        ★ Justified (Edge-to-Edge)
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Title [left] ── Date [far right]
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlignMode("left-flow")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "left-flow"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Inline Flow
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
                                        onClick={() => setAlignMode("stacked")}
                                        className={`p-1.5 rounded text-left border cursor-pointer transition-colors ${
                                            alignMode === "stacked"
                                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium border-transparent shadow-sm"
                                                : "border-current/15 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/5"
                                        }`}
                                    >
                                        Stacked (2-Line)
                                        <span className="block text-[9px] opacity-75 mt-0.5">
                                            Line 1 Title, Line 2 Date
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

                            {/* 5. Distance / Gap Slider (Between [in progress] and Date) */}
                            <div className="space-y-2 pt-2 border-t border-current/10">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[var(--text-color)]">
                                        Distance / Safety Gap:
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {entryGap}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={4}
                                    max={120}
                                    step={2}
                                    value={entryGap}
                                    onChange={(e) => setEntryGap(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    {[8, 16, 24, 28, 40, 60, 80, 100].map((g) => (
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
                                            {g}px {g === 28 ? "(bal)" : g === 60 ? "(wide)" : ""}
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

                            {/* 6. Live Sandbox Test Preview */}
                            <div className="pt-2 border-t border-current/10 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                        Live Sandbox Preview
                                    </span>
                                    <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded ${
                                        contentWidth >= 740
                                            ? "text-emerald-700 bg-emerald-500/15 dark:text-emerald-300"
                                            : "text-amber-700 bg-amber-500/15 dark:text-amber-300"
                                    }`}>
                                        {contentWidth >= 740 ? "✓ Fits on 1 line" : "⚠ Narrow: wraps to 2 lines"}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg border border-current/15 bg-current/5 space-y-2.5">
                                    {alignMode === "left-flow" && (
                                        <div className="font-serif leading-relaxed text-[var(--text-color)] text-[12.5px]">
                                            <span className="font-medium">
                                                On Knowledge Engines, Distributed Consensus, and First Principles
                                            </span>
                                            <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 whitespace-nowrap inline-block">
                                                [in progress]
                                            </span>
                                            <span
                                                className="text-[11px] font-mono text-[var(--text-color)] whitespace-nowrap inline-block transition-[margin-left] duration-100"
                                                style={{ marginLeft: `${entryGap}px` }}
                                            >
                                                2026-09-21
                                            </span>
                                        </div>
                                    )}

                                    {alignMode === "date-left" && (
                                        <div
                                            className="flex items-baseline font-serif text-[12.5px] text-[var(--text-color)] transition-[gap] duration-100"
                                            style={{ gap: `${entryGap}px` }}
                                        >
                                            <span className="text-[11px] font-mono text-[var(--text-color)] shrink-0 whitespace-nowrap">
                                                2026-09-21
                                            </span>
                                            <div className="leading-relaxed flex-1">
                                                <span className="font-medium">
                                                    On Knowledge Engines, Distributed Consensus, and First Principles
                                                </span>
                                                <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 whitespace-nowrap inline-block">
                                                    [in progress]
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {alignMode === "stacked" && (
                                        <div className="flex flex-col gap-1 font-serif text-[12.5px] text-[var(--text-color)]">
                                            <div className="leading-relaxed">
                                                <span className="font-medium">
                                                    On Knowledge Engines, Distributed Consensus, and First Principles
                                                </span>
                                                <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 whitespace-nowrap inline-block">
                                                    [in progress]
                                                </span>
                                            </div>
                                            <span
                                                className="text-[11px] font-mono text-[var(--text-color)] whitespace-nowrap transition-[margin-left] duration-100"
                                                style={{ marginLeft: `${entryGap}px` }}
                                            >
                                                2026-09-21
                                            </span>
                                        </div>
                                    )}

                                    {alignMode === "tabular" && (
                                        <div
                                            className="grid items-baseline font-serif text-[12.5px] text-[var(--text-color)] transition-[column-gap] duration-100"
                                            style={{
                                                gridTemplateColumns: "auto 1fr",
                                                columnGap: `${entryGap}px`,
                                            }}
                                        >
                                            <span className="text-[11px] font-mono text-[var(--text-color)] shrink-0 whitespace-nowrap min-w-[85px]">
                                                2026-09-21
                                            </span>
                                            <div className="leading-relaxed">
                                                <span className="font-medium">
                                                    On Knowledge Engines, Distributed Consensus, and First Principles
                                                </span>
                                                <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 whitespace-nowrap inline-block">
                                                    [in progress]
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {alignMode === "justified" && (
                                        <div className="flex justify-between items-baseline gap-3 font-serif text-[12.5px] text-[var(--text-color)]">
                                            <div className="leading-relaxed">
                                                <span className="font-medium">
                                                    On Knowledge Engines, Distributed Consensus, and First Principles
                                                </span>
                                                <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 whitespace-nowrap inline-block">
                                                    [in progress]
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-mono text-[var(--text-color)] shrink-0 whitespace-nowrap">
                                                2026-09-21
                                            </span>
                                        </div>
                                    )}

                                    {/* Visual distance ruler indicator */}
                                    <div className="pt-1.5 flex items-center justify-between text-[9px] text-emerald-600 dark:text-emerald-400 font-mono border-t border-current/10">
                                        <span>
                                            {alignMode === "date-left" || alignMode === "tabular"
                                                ? "Date"
                                                : "← Title [status]"}
                                        </span>
                                        <span className="font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            {alignMode === "justified"
                                                ? `Justified (~${Math.max(0, contentWidth - 690)}px space)`
                                                : `↔ ${entryGap}px gap / indent`}
                                        </span>
                                        <span>
                                            {alignMode === "date-left" || alignMode === "tabular"
                                                ? "Title →"
                                                : "Date →"}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                                    Tip: Drag the sliders above to test page left-alignment (&ldquo;Sahaj Singh&rdquo;), box width stretch, and spacing live!
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
