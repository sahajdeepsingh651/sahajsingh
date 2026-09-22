import Link from "next/link";
import { getAllEssays } from "@/lib/essays";
import { getAllThoughts } from "@/lib/thoughts";
import { ALL_PROJECTS } from "@/lib/projects";
import { getHomepageEssays } from "@/lib/curation";

export default function Home() {
    const essays = getHomepageEssays(getAllEssays(), 3);
    const projects = ALL_PROJECTS.slice(0, 3);
    const thoughts = getAllThoughts().slice(0, 3);

    return (
        <div className="space-y-12 max-w-2xl">
            {/* Intro statement */}
            <section className="space-y-4">
                <p className="leading-relaxed font-medium">
                    <span className="opacity-75 mr-2 select-none">※</span>I like to
                    understand things from first principles and find connections between
                    fundamental ideas across different domains.
                </p>
                <p className="leading-relaxed font-medium">
                    <span className="opacity-75 mr-2 select-none">※</span>
                    I&apos;m a software engineer by profession, deeply interested in
                    building reliable software systems.
                </p>
                <p className="text-xs font-mono text-[var(--text-muted)] pt-1">
                    More in{" "}
                    <Link
                        href="/now"
                        className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                    >
                        [now]
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/about"
                        className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                    >
                        [about]
                    </Link>{" "}
                    →
                </p>
            </section>

            {/* 1. Recent Essays (Curated Showcase) */}
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
                    {essays.map((essay) => (
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

            {/* 2. Projects */}
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
                    {projects.map((project) => (
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

            {/* 3. Recent Thoughts */}
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
                    {thoughts.map((thought) => (
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
        </div>
    );
}
