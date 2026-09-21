import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Now | Sahaj Singh",
    description: "What I'm focused on at this moment in time.",
};

export default function NowPage() {
    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">Now</h1>
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                    <time>September 2026</time>
                    <span>•</span>
                    <span>Bangalore, India</span>
                </div>
            </header>

            {/* Natural Journal / Desk Dispatch */}
            <article className="space-y-5 leading-relaxed font-normal">
                <p>
                    I&apos;m currently working as a software engineer, with most of my spare
                    cognitive energy going into understanding software systems from first principles
                    and crafting this digital garden from scratch.
                </p>

                <p>
                    On my desk right now are a few books on systems programming, language foundations,
                    and philosophy. I&apos;m trying to read slower, take fewer passive inputs,
                    and write down thoughts as they form.
                </p>

                <p>
                    Outside of code, I&apos;ve been maintaining a daily meditation practice,
                    taking long walks, and deliberately spending more quiet hours away from glowing screens.
                </p>
            </article>

            {/* Colophon */}
            <footer className="pt-6 border-t border-current/10 text-xs font-mono text-[var(--text-muted)]">
                This is a{" "}
                <a
                    href="https://nownownow.com/about"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--text-color)] transition-colors"
                >
                    now page
                </a>
                , inspired by Derek Sivers.
            </footer>
        </div>
    );
}
