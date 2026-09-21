"use client";

import { useState } from "react";
import Link from "next/link";
import type { EssayMeta } from "@/lib/essays";
import type { Project } from "@/lib/projects";
import type { ThoughtMeta } from "@/lib/thoughts";

interface HomeFeedExperimentProps {
    essays: EssayMeta[];
    projects: Project[];
    thoughts: ThoughtMeta[];
}

type CountChoice = number | "all";

export default function HomeFeedExperiment({
    essays,
    projects,
    thoughts,
}: HomeFeedExperimentProps) {
    const [essayCount, setEssayCount] = useState<CountChoice>(2);
    const [projectCount, setProjectCount] = useState<CountChoice>(2);
    const [thoughtCount, setThoughtCount] = useState<CountChoice>(3);
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const visibleEssays =
        essayCount === "all" ? essays : essays.slice(0, essayCount);
    const visibleProjects =
        projectCount === "all" ? projects : projects.slice(0, projectCount);
    const visibleThoughts =
        thoughtCount === "all" ? thoughts : thoughts.slice(0, thoughtCount);

    const applyPreset = (e: CountChoice, p: CountChoice, t: CountChoice) => {
        setEssayCount(e);
        setProjectCount(p);
        setThoughtCount(t);
    };

    return (
        <div className="space-y-12">
            {/* Interactive Density Experiment Toolbar */}
            <aside
                aria-label="Feed Experiment Controls"
                className="p-3.5 rounded border border-current/15 bg-stone-500/5 space-y-3 text-xs font-mono text-[var(--text-muted)]"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-color)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Home Feed Density Experiment
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--text-muted)]">
                            Essays: <strong className="text-[var(--text-color)]">{essayCount}</strong> · Projects:{" "}
                            <strong className="text-[var(--text-color)]">{projectCount}</strong> · Thoughts:{" "}
                            <strong className="text-[var(--text-color)]">{thoughtCount}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[11px] text-[var(--text-color)] hover:underline cursor-pointer"
                        >
                            {isOpen ? "[hide controls]" : "[show controls]"}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="space-y-2.5 pt-2 border-t border-current/10">
                        {/* Essays row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-20 text-[11px] text-[var(--text-muted)]">Essays:</span>
                            {([1, 2, 3, 4, "all"] as const).map((count) => (
                                <button
                                    key={String(count)}
                                    type="button"
                                    onClick={() => setEssayCount(count)}
                                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                        essayCount === count
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    [{count}]
                                </button>
                            ))}
                        </div>

                        {/* Projects row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-20 text-[11px] text-[var(--text-muted)]">Projects:</span>
                            {([1, 2, 3, "all"] as const).map((count) => (
                                <button
                                    key={String(count)}
                                    type="button"
                                    onClick={() => setProjectCount(count)}
                                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                        projectCount === count
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    [{count}]
                                </button>
                            ))}
                        </div>

                        {/* Thoughts row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-20 text-[11px] text-[var(--text-muted)]">Thoughts:</span>
                            {([1, 2, 3, 4, 5, "all"] as const).map((count) => (
                                <button
                                    key={String(count)}
                                    type="button"
                                    onClick={() => setThoughtCount(count)}
                                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                        thoughtCount === count
                                            ? "bg-[var(--text-color)] text-[var(--bg-color)] font-medium"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                                    }`}
                                >
                                    [{count}]
                                </button>
                            ))}
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-current/10">
                            <span className="w-20 text-[11px] text-[var(--text-muted)]">Presets:</span>
                            <button
                                type="button"
                                onClick={() => applyPreset(1, 1, 2)}
                                className="px-2 py-0.5 rounded cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                            >
                                [Quiet 1·1·2]
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset(2, 2, 3)}
                                className="px-2 py-0.5 rounded cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                            >
                                [Balanced 2·2·3]
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset(4, 3, 4)}
                                className="px-2 py-0.5 rounded cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                            >
                                [Dense 4·3·4]
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset("all", "all", "all")}
                                className="px-2 py-0.5 rounded cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-current/10"
                            >
                                [Everything]
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* 1. RECENT ESSAYS */}
            {visibleEssays.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-current/10 pb-2">
                        <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                            Recent Essays
                        </h2>
                        <Link
                            href="/essays"
                            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                        >
                            view all [essays] →
                        </Link>
                    </div>

                    <ul className="space-y-3 font-normal">
                        {visibleEssays.map((essay) => (
                            <li
                                key={essay.slug}
                                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                            >
                                <Link
                                    href={`/essays/${essay.slug}`}
                                    className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40"
                                >
                                    {essay.title}
                                </Link>
                                <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                                    {essay.date}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* 2. PROJECTS */}
            {visibleProjects.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-current/10 pb-2">
                        <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                            Projects
                        </h2>
                        <Link
                            href="/projects"
                            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                        >
                            view all [projects] →
                        </Link>
                    </div>

                    <ul className="space-y-4 font-normal">
                        {visibleProjects.map((project) => (
                            <li key={project.title} className="space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                    {project.link ? (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40 inline-flex items-center gap-1.5"
                                        >
                                            <span>{project.title}</span>
                                            <span className="text-xs font-mono text-[var(--text-muted)]">↗</span>
                                        </a>
                                    ) : (
                                        <span className="text-[var(--text-color)]">{project.title}</span>
                                    )}
                                    <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                                        [{project.status}]
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-3 text-xs font-mono text-[var(--text-muted)]">
                                    {project.tech.map((t) => (
                                        <span key={t}>• {t}</span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* 3. RECENT THOUGHTS */}
            {visibleThoughts.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-current/10 pb-2">
                        <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                            Recent Thoughts
                        </h2>
                        <Link
                            href="/thoughts"
                            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                        >
                            view all [thoughts] →
                        </Link>
                    </div>

                    <ul className="space-y-3 font-normal">
                        {visibleThoughts.map((thought) => (
                            <li
                                key={thought.slug}
                                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                            >
                                <Link
                                    href={`/thoughts/${thought.slug}`}
                                    className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40"
                                >
                                    {thought.title}
                                </Link>
                                <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                                    {thought.date}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
