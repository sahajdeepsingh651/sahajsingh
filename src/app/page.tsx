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

                <ul className="space-y-3 font-normal">
                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/projects"
                            className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40"
                        >
                            Knowledge Engine &amp; Autonomous Crawler
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                            [active build]
                        </span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/projects"
                            className="text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40"
                        >
                            Personal Field Notebook &amp; Digital Garden
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-color)] shrink-0">
                            [deployed]
                        </span>
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
