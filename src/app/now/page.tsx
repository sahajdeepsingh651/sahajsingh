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
                    <span>What I&apos;m focused on right now</span>
                </div>
            </header>

            {/* Thematic Sections */}
            <div className="space-y-8">
                <section className="space-y-2">
                    <h2 className="text-xs uppercase font-mono tracking-widest text-[var(--text-muted)]">
                        Building
                    </h2>
                    <ul className="space-y-2 leading-relaxed">
                        <li className="flex items-start">
                            <span className="opacity-75 mr-2 select-none shrink-0">※</span>
                            <span>
                                Crafting this personal digital garden and field notebook from scratch using Next.js and TypeScript.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="opacity-75 mr-2 select-none shrink-0">※</span>
                            <span>
                                Studying reliable software architectures and language foundations from first principles.
                            </span>
                        </li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xs uppercase font-mono tracking-widest text-[var(--text-muted)]">
                        Reading
                    </h2>
                    <ul className="space-y-2 leading-relaxed">
                        <li className="flex items-start">
                            <span className="opacity-75 mr-2 select-none shrink-0">※</span>
                            <span>
                                Books and essays on software engineering, distributed systems, and philosophy.
                            </span>
                        </li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xs uppercase font-mono tracking-widest text-[var(--text-muted)]">
                        Practice
                    </h2>
                    <ul className="space-y-2 leading-relaxed">
                        <li className="flex items-start">
                            <span className="opacity-75 mr-2 select-none shrink-0">※</span>
                            <span>
                                Daily meditation and quiet contemplation.
                            </span>
                        </li>
                    </ul>
                </section>
            </div>

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
