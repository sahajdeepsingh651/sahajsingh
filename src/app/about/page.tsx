import type { Metadata } from "next";
import Link from "next/link";
import { STATUS_CONFIG, CONFIDENCE_CONFIG } from "@/lib/metadata";

export const metadata: Metadata = {
    title: "About | Sahaj Singh",
    description: "About Sahaj Singh and the design philosophy of this field notebook.",
};

export default function AboutPage() {
    return (
        <div className="space-y-16 max-w-2xl">
            {/* Page Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">About</h1>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                    Two perspectives: the author and the notebook.
                </p>
            </header>

            {/* Section 1: About Me */}
            <section id="about-me" className="space-y-6 scroll-mt-12">
                <div className="border-b border-current/10 pb-2">
                    <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                        About Me
                    </h2>
                </div>

                <div className="space-y-4 leading-relaxed font-normal">
                    <p>
                        I am Sahaj Deep Singh, a software engineer deeply interested in understanding
                        things from first principles and building reliable software systems.
                    </p>
                    <p>
                        I like finding connections between fundamental ideas across different domains—from
                        distributed systems, networking, and programming language paradigms to physics,
                        cognition, and endurance athletics.
                    </p>
                    <p className="text-xs font-mono text-[var(--text-muted)] pt-1">
                        To see what I am actively reading, building, and training for at this moment, visit the{" "}
                        <Link
                            href="/now"
                            className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                        >
                            [now]
                        </Link>{" "}
                        page.
                    </p>
                </div>
            </section>

            {/* Section 2: About Site */}
            <section id="about-site" className="space-y-10 scroll-mt-12">
                <div className="border-b border-current/10 pb-2">
                    <h2 className="text-sm uppercase tracking-widest font-mono text-[var(--text-muted)]">
                        About Site
                    </h2>
                </div>

                <div className="space-y-4 leading-relaxed font-normal">
                    <p>
                        This site is an atmospheric personal field notebook and digital garden. Rather than treating
                        it as a static portfolio or a chronological blog, it serves as a living workspace for
                        exploring ideas, tracking intellectual development, and recording long-term inquiries.
                    </p>
                    <p>
                        The visual identity draws inspiration from physical books, typography, and nocturnal
                        observation: warm parchment by day, deep cosmic night skies by night, set in classic editorial
                        serif typography.
                    </p>
                </div>

                {/* Document Status */}
                <div id="status" className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10">
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Document Maturity (Status)
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            How finished or developed a document is.
                        </p>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Inspired by Gwern.net, every essay carries a status tag indicating its stage of
                        editorial development:
                    </p>
                    <dl className="space-y-3 font-normal text-sm">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <div key={key} className="space-y-1">
                                <dt className="font-mono text-xs font-medium text-[var(--text-color)]">
                                    {config.label}
                                </dt>
                                <dd className="text-sm text-[var(--text-muted)] pl-3 border-l border-current/15 leading-relaxed font-serif">
                                    {config.desc}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Epistemic Confidence */}
                <div id="confidence" className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10">
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Epistemic Confidence (Personal Belief)
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            Subjective probability in the essay&apos;s central claims.
                        </p>
                    </div>

                    <div className="p-4 rounded border border-current/10 space-y-2 bg-current/[0.02]">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-medium">
                            What Confidence Means Here
                        </h4>
                        <p className="text-sm leading-relaxed text-[var(--text-muted)] font-serif">
                            The confidence score reflects <strong>my personal subjective degree of belief</strong> in the
                            central thesis of the essay given what I currently know. It is <em>not</em> an assertion of
                            objective consensus, mathematical proof, or peer-reviewed finality.
                        </p>
                        <p className="text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-current/10">
                            Status and confidence are orthogonal: an essay can be a polished, finished text while
                            arguing for a highly speculative hypothesis (low confidence), or an unpolished seed
                            recording a fact known with near-certainty.
                        </p>
                    </div>

                    <p className="text-sm leading-relaxed">
                        Probabilities are mapped using the Kesselman list of estimative words adapted by Gwern:
                    </p>

                    <dl className="space-y-3.5 font-normal text-sm">
                        {Object.entries(CONFIDENCE_CONFIG).map(([key, config]) => (
                            <div key={key} className="space-y-1">
                                <dt className="font-mono text-xs font-medium text-[var(--text-color)] flex items-baseline justify-between">
                                    <span>{config.label}</span>
                                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{config.range}</span>
                                </dt>
                                <dd className="text-sm text-[var(--text-muted)] pl-3 border-l border-current/15 italic font-serif leading-relaxed">
                                    &ldquo;{config.desc}&rdquo;
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Revision History Philosophy */}
                <div id="revisions" className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10">
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Revision History
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            Human intellectual changelog vs. Git commits.
                        </p>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)] font-serif">
                        Essays include an explicit revision log in the footer. Unlike Git commits (which track typos,
                        formatting, and mechanical refactors), the revision history captures substantive intellectual
                        shifts: changes in evidence, updated arguments, or conceded counterpoints over time.
                    </p>
                </div>
            </section>
        </div>
    );
}
