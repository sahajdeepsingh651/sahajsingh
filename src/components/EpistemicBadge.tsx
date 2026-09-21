"use client";

import { useState, useRef, useEffect } from "react";
import {
    DocumentStatus,
    EpistemicConfidence,
    STATUS_CONFIG,
    CONFIDENCE_CONFIG,
} from "@/lib/metadata";

interface EpistemicBadgeProps {
    status?: DocumentStatus;
    confidence?: EpistemicConfidence;
}

export default function EpistemicBadge({
    status,
    confidence,
}: EpistemicBadgeProps) {
    const [activePopover, setActivePopover] = useState<
        "status" | "confidence" | null
    >(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside or Escape
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setActivePopover(null);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setActivePopover(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (!status && !confidence) {
        return null;
    }

    const statusInfo = status ? STATUS_CONFIG[status] : null;
    const confidenceInfo = confidence ? CONFIDENCE_CONFIG[confidence] : null;

    return (
        <div
            ref={containerRef}
            className="relative inline-flex flex-wrap items-center gap-2 text-xs font-mono select-none"
        >
            {/* Status Indicator */}
            {statusInfo && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setActivePopover((curr) =>
                                curr === "status" ? null : "status"
                            )
                        }
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            activePopover === "status"
                                ? "border-current bg-current/10 text-[var(--text-color)]"
                                : "border-current/20 hover:border-current/40 text-[var(--text-muted)] hover:text-[var(--text-color)] bg-stone-500/5"
                        }`}
                        aria-expanded={activePopover === "status"}
                        title="Click to learn what document status means"
                    >
                        <span className="opacity-60">status:</span>
                        <span className="font-medium text-[var(--text-color)]">
                            {statusInfo.label}
                        </span>
                    </button>

                    {activePopover === "status" && (
                        <div
                            role="dialog"
                            className="absolute left-0 top-full mt-2 z-30 w-72 sm:w-80 p-3.5 rounded-md border border-current/15 bg-[var(--bg-color)] shadow-xl text-left font-sans"
                        >
                            <div className="flex items-baseline justify-between border-b border-current/10 pb-1.5 mb-2 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                                <span>Document Maturity</span>
                                <span className="font-semibold text-[var(--text-color)]">
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--text-color)] leading-relaxed mb-2 font-serif">
                                {statusInfo.desc}
                            </p>
                            <p className="text-[11px] font-mono text-[var(--text-muted)] border-t border-current/10 pt-1.5">
                                Status tracks the drafting stage of this text, independent of belief.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Confidence Indicator */}
            {confidenceInfo && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setActivePopover((curr) =>
                                curr === "confidence" ? null : "confidence"
                            )
                        }
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            activePopover === "confidence"
                                ? "border-current bg-current/10 text-[var(--text-color)]"
                                : "border-current/20 hover:border-current/40 text-[var(--text-muted)] hover:text-[var(--text-color)] bg-stone-500/5"
                        }`}
                        aria-expanded={activePopover === "confidence"}
                        title="Click to learn what author confidence means"
                    >
                        <span className="opacity-60">confidence:</span>
                        <span className="font-medium text-[var(--text-color)]">
                            {confidenceInfo.label} ({confidenceInfo.range})
                        </span>
                        <span className="text-[10px] opacity-70 border border-current/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">
                            ?
                        </span>
                    </button>

                    {activePopover === "confidence" && (
                        <div
                            role="dialog"
                            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-30 w-80 sm:w-96 p-4 rounded-md border border-current/15 bg-[var(--bg-color)] shadow-xl text-left font-sans"
                        >
                            <div className="flex items-baseline justify-between border-b border-current/10 pb-2 mb-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                                <span>Epistemic Confidence</span>
                                <span className="font-semibold text-[var(--text-color)]">
                                    {confidenceInfo.range}
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider font-mono text-[var(--text-muted)] mb-0.5">
                                        Personal Belief, Not Consensus
                                    </div>
                                    <p className="text-xs text-[var(--text-color)] font-serif leading-relaxed">
                                        This rating represents Sahaj&apos;s subjective degree of belief in the essay&apos;s core thesis based on current understanding, rather than an objective or peer-reviewed certainty.
                                    </p>
                                </div>

                                <div className="p-2.5 rounded bg-stone-500/5 border border-current/10">
                                    <div className="text-[11px] font-mono font-medium text-[var(--text-color)] mb-1">
                                        {confidenceInfo.label} ({confidenceInfo.range})
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] font-serif italic leading-relaxed">
                                        &ldquo;{confidenceInfo.desc}&rdquo;
                                    </p>
                                </div>

                                <p className="text-[11px] font-mono text-[var(--text-muted)] pt-1 border-t border-current/10">
                                    Adapted from Gwern.net and the Kesselman list of estimative probability words.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
