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
                    <span>Nashik, India</span>
                </div>
            </header>

            {/* Natural Journal / Desk Dispatch */}
            <article className="space-y-5 leading-relaxed font-normal">
                <p>
                    Working on developing a knowledge engine which is my answer to how to
                    use AI for doing research and study and developing a web crawler for
                    understanding Go
                </p>

                <p>
                    Currently reading Computer Networking a top down approach 9th edition
                    and fabric of reality
                </p>

                <p>
                    Have started gym and running again, training for a coming last man
                    standing endurance event
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
