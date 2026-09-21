"use client";

import { useState } from "react";
import Link from "next/link";
import { DocumentModification } from "@/lib/metadata";
import { EssayReference } from "@/lib/essays";

interface EssayFooterExperimentProps {
    modifications?: DocumentModification[];
    references?: EssayReference[];
    originalUrl?: string;
}

type LayoutMode = "ledger" | "scriptorium" | "sidenotes" | "minimal";

export default function EssayFooterExperiment({
    modifications = [],
    references = [],
    originalUrl,
}: EssayFooterExperimentProps) {
    const [layout, setLayout] = useState<LayoutMode>("ledger");

    if (modifications.length === 0 && references.length === 0 && !originalUrl) {
        return null;
    }

    return (
        <footer className="pt-8 mt-14 border-t border-current/10 space-y-8 text-xs font-mono text-[var(--text-muted)]">
            {/* Interactive Experiment Switcher Toolbar */}
            <div className="p-3 rounded border border-current/15 bg-stone-500/5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Footer Experiment Mode
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                        Active Layout: <strong className="text-[var(--text-color)]">{layout}</strong>
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-current/10 text-xs">
                    <span className="text-[11px] text-[var(--text-muted)]">Switch:</span>
                    <button
                        type="button"
                        onClick={() => setLayout("ledger")}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            layout === "ledger"
                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                        }`}
                    >
                        [1. Ledger]
                    </button>
                    <button
                        type="button"
                        onClick={() => setLayout("scriptorium")}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            layout === "scriptorium"
                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                        }`}
                    >
                        [2. Scriptorium]
                    </button>
                    <button
                        type="button"
                        onClick={() => setLayout("sidenotes")}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            layout === "sidenotes"
                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                        }`}
                    >
                        [3. Sidenotes]
                    </button>
                    <button
                        type="button"
                        onClick={() => setLayout("minimal")}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            layout === "minimal"
                                ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                        }`}
                    >
                        [4. Minimal]
                    </button>
                </div>
            </div>

            {/* LAYOUT 1: LEDGER (Stacked Linear Academic Standard) */}
            {layout === "ledger" && (
                <div className="space-y-8">
                    {/* Revision History */}
                    {modifications.length > 0 && (
                        <section className="space-y-3">
                            <div className="flex items-baseline justify-between border-b border-current/10 pb-1.5">
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                                    Revision History
                                </h3>
                                <Link
                                    href="/about#revisions"
                                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline underline-offset-2"
                                >
                                    about changelog →
                                </Link>
                            </div>
                            <ul className="space-y-2.5">
                                {modifications.map((mod, i) => (
                                    <li
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4"
                                    >
                                        <time className="shrink-0 text-[var(--text-muted)] font-mono">
                                            {mod.date}
                                        </time>
                                        <span className="font-serif text-[13px] text-[var(--text-muted)] leading-relaxed">
                                            {mod.note}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Annotated Bibliography */}
                    {references.length > 0 && (
                        <section className="space-y-4">
                            <div className="border-b border-current/10 pb-1.5">
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                                    References & Annotations
                                </h3>
                            </div>
                            <ol className="space-y-4 list-none">
                                {references.map((ref) => (
                                    <li
                                        key={ref.id}
                                        id={`ref-${ref.id}`}
                                        className="group space-y-1 pl-3 border-l-2 border-current/15 hover:border-current/40 transition-colors scroll-mt-14"
                                    >
                                        <div className="flex items-baseline justify-between gap-2">
                                            <div className="font-serif text-[14px] text-[var(--text-color)]">
                                                <span className="font-mono text-xs text-[var(--text-muted)] mr-1.5">
                                                    [{ref.id}]
                                                </span>
                                                {ref.url ? (
                                                    <a
                                                        href={ref.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline underline-offset-4 decoration-current/40"
                                                    >
                                                        {ref.title}
                                                    </a>
                                                ) : (
                                                    <span>{ref.title}</span>
                                                )}
                                                {ref.author && (
                                                    <span className="text-[var(--text-muted)] text-[13px]">
                                                        {" "}— {ref.author}
                                                    </span>
                                                )}
                                                {ref.date && (
                                                    <span className="font-mono text-xs text-[var(--text-muted)]">
                                                        {" "}({ref.date})
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={`#cite-${ref.id}`}
                                                title="Jump back to citation in text"
                                                className="text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline font-mono text-xs shrink-0"
                                            >
                                                ↩
                                            </a>
                                        </div>
                                        {ref.note && (
                                            <p className="font-serif text-[12px] italic text-[var(--text-muted)] leading-relaxed pl-5">
                                                {ref.note}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>
            )}

            {/* LAYOUT 2: SCRIPTORIUM (Two-Column Split on Desktop) */}
            {layout === "scriptorium" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Revision Log & Colophon */}
                    <div className="md:col-span-5 space-y-6">
                        {modifications.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)] border-b border-current/10 pb-1.5">
                                    Revision Log
                                </h3>
                                <ul className="space-y-3">
                                    {modifications.map((mod, i) => (
                                        <li key={i} className="space-y-0.5">
                                            <time className="block text-[11px] font-mono text-[var(--text-muted)]">
                                                {mod.date}
                                            </time>
                                            <p className="font-serif text-[12px] text-[var(--text-muted)] leading-normal">
                                                {mod.note}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div className="pt-3 border-t border-current/10 text-[11px] text-[var(--text-muted)]">
                            <p>Field notebook dispatch.</p>
                        </div>
                    </div>

                    {/* Right Column: References */}
                    <div className="md:col-span-7 space-y-4">
                        {references.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)] border-b border-current/10 pb-1.5">
                                    Annotated Citations
                                </h3>
                                <ul className="space-y-3.5">
                                    {references.map((ref) => (
                                        <li
                                            key={ref.id}
                                            id={`ref-${ref.id}`}
                                            className="space-y-1 scroll-mt-14"
                                        >
                                            <div className="font-serif text-[13px] text-[var(--text-color)] leading-snug">
                                                <span className="font-mono text-xs text-[var(--text-muted)] mr-1">
                                                    [{ref.id}]
                                                </span>
                                                {ref.url ? (
                                                    <a
                                                        href={ref.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline underline-offset-2"
                                                    >
                                                        {ref.title}
                                                    </a>
                                                ) : (
                                                    ref.title
                                                )}
                                                {ref.author && (
                                                    <span className="text-[var(--text-muted)]">
                                                        , {ref.author}
                                                    </span>
                                                )}
                                                {ref.date && (
                                                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                                        {" "}({ref.date})
                                                    </span>
                                                )}
                                            </div>
                                            {ref.note && (
                                                <p className="font-serif text-[11.5px] italic text-[var(--text-muted)] leading-relaxed pl-3 border-l border-current/15">
                                                    {ref.note}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            )}

            {/* LAYOUT 3: SIDENOTES (Side Card Simulation) */}
            {layout === "sidenotes" && (
                <div className="space-y-6">
                    <div className="p-3 rounded border border-dashed border-current/20 text-xs font-serif italic text-[var(--text-muted)]">
                        ℹ️ Sidenote Mode Preview: In this layout, citations are rendered as marginal cards with prominent reference anchors and notes.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {references.map((ref) => (
                            <div
                                key={ref.id}
                                id={`ref-${ref.id}`}
                                className="p-3 rounded bg-current/[0.02] border border-current/15 space-y-1.5 scroll-mt-14"
                            >
                                <div className="flex items-baseline justify-between">
                                    <span className="font-mono text-xs font-bold text-[var(--text-color)]">
                                        Ref [{ref.id}]
                                    </span>
                                    <a
                                        href={`#cite-${ref.id}`}
                                        className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline"
                                    >
                                        back to text ↩
                                    </a>
                                </div>
                                <div className="font-serif text-[13px] text-[var(--text-color)] font-medium leading-snug">
                                    {ref.url ? (
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {ref.title}
                                        </a>
                                    ) : (
                                        ref.title
                                    )}
                                </div>
                                {(ref.author || ref.date) && (
                                    <div className="text-[11px] font-mono text-[var(--text-muted)]">
                                        {ref.author} {ref.date ? `(${ref.date})` : ""}
                                    </div>
                                )}
                                {ref.note && (
                                    <p className="text-[12px] font-serif italic text-[var(--text-muted)] leading-relaxed pt-1 border-t border-current/10">
                                        {ref.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LAYOUT 4: MINIMAL (Quiet Compact Gwern Notes) */}
            {layout === "minimal" && (
                <div className="space-y-4">
                    <div className="border-b border-current/10 pb-1">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                            Notes & Sources
                        </span>
                    </div>
                    <ol className="space-y-1.5 list-none font-serif text-[13px]">
                        {references.map((ref) => (
                            <li
                                key={ref.id}
                                id={`ref-${ref.id}`}
                                className="flex items-baseline gap-2 scroll-mt-14"
                            >
                                <span className="font-mono text-xs text-[var(--text-muted)] shrink-0">
                                    [{ref.id}]
                                </span>
                                <div className="leading-snug">
                                    {ref.url ? (
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-[var(--text-color)]"
                                        >
                                            {ref.title}
                                        </a>
                                    ) : (
                                        <span className="text-[var(--text-color)]">{ref.title}</span>
                                    )}
                                    {ref.author && (
                                        <span className="text-[var(--text-muted)]">
                                            , {ref.author}
                                        </span>
                                    )}
                                    {ref.date && (
                                        <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                            {" "}({ref.date})
                                        </span>
                                    )}
                                    {ref.note && (
                                        <span className="text-[var(--text-muted)] italic text-[12px] ml-2">
                                            — {ref.note}
                                        </span>
                                    )}
                                </div>
                                <a
                                    href={`#cite-${ref.id}`}
                                    className="text-[var(--text-muted)] hover:text-[var(--text-color)] text-xs font-mono ml-auto shrink-0"
                                >
                                    ↩
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Colophon & Original Link (Always Present at the Very End) */}
            {originalUrl && (
                <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <p>
                        Originally published on{" "}
                        <a
                            href={originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                        >
                            Medium
                        </a>
                        .
                    </p>
                    <span className="text-[11px] text-[var(--text-muted)]">
                        Permanent field notebook archive
                    </span>
                </div>
            )}
        </footer>
    );
}
