import Link from "next/link";

export default function Home() {
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
                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/essays/beating-the-averages"
                            className="hover:underline underline-offset-4 decoration-current/40"
                        >
                            My views on &ldquo;Beating the Averages&rdquo; by Paul Graham
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-muted)]">
                            2025-06-26
                        </span>
                    </li>
                </ul>
            </section>
        </div>
    );
}
