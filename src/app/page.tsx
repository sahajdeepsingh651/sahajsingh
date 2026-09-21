import Link from "next/link";
import { getAllEssays } from "@/lib/essays";
import { getAllThoughts } from "@/lib/thoughts";

export default function Home() {
    const essays = getAllEssays().slice(0, 4);
    const thoughts = getAllThoughts().slice(0, 4);

    return (
        <div className="space-y-12 max-w-2xl">
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
                    <li className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <a
                                href="https://github.com/sahajdeepsingh651/knowledge_engine"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40 inline-flex items-center gap-1.5"
                            >
                                <span>Knowledge Engine &amp; Autonomous Crawler</span>
                                <span className="text-xs font-mono text-[var(--text-muted)]">↗</span>
                            </a>
                            <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                                [active build]
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 text-xs font-mono text-[var(--text-muted)]">
                            <span>. Go</span>
                            <span>. Distributed Systems</span>
                            <span>. Networking</span>
                            <span>. ASTs</span>
                        </div>
                    </li>
                    <li className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <a
                                href="https://github.com/sahajdeepsingh651/sahajsingh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40 inline-flex items-center gap-1.5"
                            >
                                <span>Personal Field Notebook &amp; Digital Garden</span>
                                <span className="text-xs font-mono text-[var(--text-muted)]">↗</span>
                            </a>
                            <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                                [deployed]
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 text-xs font-mono text-[var(--text-muted)]">
                            <span>. Next.js</span>
                            <span>. React</span>
                            <span>. TypeScript</span>
                            <span>. Tailwind CSS</span>
                        </div>
                    </li>
                </ul>
            </section>

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
