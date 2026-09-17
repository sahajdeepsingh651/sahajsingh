import Link from "next/link";
export default function HomePage() {
    return (
        <div className="space-y-12 max-w-2xl">
            {/* Opening Gateway / Statement */}
            <section className="space-y-4 bio-section">
                <p className="leading-relaxed font-medium symbol-bio-1">
                    I like to understand things from first principles and find connections
                    between fundamental ideas across different domains.
                </p>
                <p className="leading-relaxed font-medium symbol-bio-2">
                    I&apos;m a software engineer by profession, deeply interested in building
                    reliable software systems.
                </p>
            </section>

            {/* Hairline Divider with optional symbol */}
            <div className="relative my-8 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-current/15" />
                </div>
                <span className="relative symbol-divider bg-[var(--bg-color)] px-2 text-xs opacity-60"></span>
            </div>

            {/* Recent Meditations (Testing 2-column log & old-style numbers) */}
            <section className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-current/10 pb-2">
                    <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                        Recent Notes & Meditations
                    </h2>
                    <Link
                        href="/blog"
                        className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors symbol-pointer"
                    >
                        view all [essays]
                    </Link>
                </div>

                <ul className="space-y-3 font-normal">
                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/blog"
                            className="hover:underline underline-offset-4 decoration-current/40"
                        >
                            On building tools with ink and intention
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-muted)]">2026-09-17</span>
                    </li>

                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/blog"
                            className="hover:underline underline-offset-4 decoration-current/40"
                        >
                            The architecture of 19th-century letterpress typography
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-muted)]">2026-08-19</span>
                    </li>

                    <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <Link
                            href="/blog"
                            className="hover:underline underline-offset-4 decoration-current/40"
                        >
                            First principles: memory layout, cache lines, and silicon
                        </Link>
                        <span className="text-sm font-mono text-[var(--text-muted)]">2025-11-04</span>
                    </li>
                </ul>
            </section>

            {/* Six-Month Focus (Now Teaser) */}
            <section className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between border-b border-current/10 pb-2">
                    <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                        Current Horizon
                    </h2>
                    <Link
                        href="/now"
                        className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors symbol-pointer"
                    >
                        explore [now]
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm opacity-85">
                    <div className="p-3 border border-current/10 rounded-xs space-y-1">
                        <span className="font-semibold block text-base">Building</span>
                        <p className="text-[var(--text-muted)]">
                            A minimalist intellectual notebook engine with zero third-party
                            bloat and mathematical typography.
                        </p>
                    </div>

                    <div className="p-3 border border-current/10 rounded-xs space-y-1">
                        <span className="font-semibold block text-base">Reading</span>
                        <p className="text-[var(--text-muted)]">
                            Knuth&apos;s <em>TeX and Metafont</em>, Marcus Aurelius&apos;s{" "}
                            <em>Meditations</em>, and modern database theory.
                        </p>
                    </div>
                </div>
            </section>

            {/* Typographic Specimen String for Numerals & Ligatures */}
            <section className="pt-6 border-t border-current/10 text-xs text-[var(--text-muted)] font-mono flex flex-wrap gap-4 justify-between">
                <span>Digits: 0123456789 (born 19-08-2003)</span>
                <span>Ligatures: fi fl ff ffi ffl</span>
                <span>Coordinates: 19.9975° N, 73.7898° E</span>
            </section>
        </div>
    );
}
