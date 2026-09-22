import type { Metadata } from "next";
import Link from "next/link";
import { STATUS_CONFIG, CONFIDENCE_CONFIG } from "@/lib/metadata";

export const metadata: Metadata = {
    title: "About | Sahaj Singh",
    description:
        "About Sahaj Singh and the design philosophy of this field notebook.",
};

export default function AboutPage() {
    return (
        <div className="space-y-16 max-w-2xl">
            {/* Page Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">
                    About
                </h1>
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
                        I am Sahaj Deep Singh, currently working as a Software Engineer
                        (Research and Development Associate) at ESDS Software Solution
                        Limited.
                    </p>
                    <p>
                        As a software engineer, I am interested in building scalable,
                        modular and reliable software. To me:
                    </p>
                    <ul className="space-y-2 text-sm text-[var(--text-muted)] font-normal pl-3 border-l border-current/15 my-2">
                        <li>
                            <strong className="text-[var(--text-color)] font-mono text-xs">
                                [scalable]
                            </strong>{" "}
                            Scalable means it scales well according to the initial business
                            goals set by stakeholders.
                        </li>
                        <li>
                            <strong className="text-[var(--text-color)] font-mono text-xs">
                                [modular]
                            </strong>{" "}
                            Modular means developers can make quality contributions to the
                            code without going too low level and just treating some code as
                            black boxes.
                        </li>
                        <li>
                            <strong className="text-[var(--text-color)] font-mono text-xs">
                                [reliable]
                            </strong>{" "}
                            Reliable means it performs according to the expectations of
                            stakeholders.
                        </li>
                    </ul>

                    <p>
                        Some of the softwares that I like using is tmux and git. I am a big
                        fan of the Unix philosophy.
                    </p>
                    <p>
                        Outside software engineering, I am interested in mathematics,
                        philosophy, and learning about how different disciplines are
                        connected. I aspire to be a polymath. I am interested in knowledge
                        and finding things out, and finding common abstractions between
                        different domains is something I enjoy.
                    </p>
                    <p>
                        In a pragmatic sense, I believe all knowledge is connected at some
                        fundamental level that is, there is an epistemic core. This makes
                        the goal of becoming a polymath quite practical and possible. My
                        motivation is simple: I just enjoy the process of building an
                        understanding of things, either by reading or by building
                        prototypes. And of course, I consider this a cool pursuit to have.
                    </p>
                    <p>
                        I also enjoy endurance sports and physical training. I have done a
                        half marathon, and I am currently training to be a marathon runner,
                        with a long-term goal of becoming a triathlete.
                    </p>

                    {/* Information Diet */}
                    <div className="pt-4 border-t border-current/10 space-y-2">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Information Diet &amp; Influences
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            News aggregators and blogs I follow include{" "}
                            <a
                                href="https://news.ycombinator.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-color)] underline underline-offset-4 decoration-current/30 hover:decoration-current"
                            >
                                Hacker News
                            </a>
                            ,{" "}
                            <a
                                href="https://paulgraham.com/articles.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-color)] underline underline-offset-4 decoration-current/30 hover:decoration-current"
                            >
                                Paul Graham
                            </a>
                            , and{" "}
                            <a
                                href="https://bytebytego.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-color)] underline underline-offset-4 decoration-current/30 hover:decoration-current"
                            >
                                ByteByteGo
                            </a>
                            . For books, I track my reading diet on Goodreads, physical workouts on Hevy, and I also enjoy anime.
                        </p>
                    </div>

                    {/* Online Coordinates */}
                    <div className="pt-4 border-t border-current/10 space-y-3">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Online Coordinates
                        </h3>
                        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-[var(--text-muted)]">
                            <li>
                                <a
                                    href="https://github.com/sahajdeepsingh651"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [github ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [linkedin ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://x.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [twitter / x ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:sahajdeepsingh100@gmail.com"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [email ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.goodreads.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [goodreads ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://hevy.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [hevy ↗]
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--text-color)] underline underline-offset-4 decoration-current/30"
                                >
                                    [resume ↗]
                                </a>
                            </li>
                        </ul>
                    </div>

                    <p className="text-xs font-mono text-[var(--text-muted)] pt-2">
                        To see what I am actively reading, building, and training for at
                        this moment, visit the{" "}
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
                        This site is an atmospheric personal field notebook and digital
                        garden. Rather than treating it as a static portfolio or a
                        chronological blog, it serves as a living workspace for exploring
                        ideas, tracking intellectual development, and recording long-term
                        inquiries.
                    </p>
                    <p>
                        The visual identity draws inspiration from physical books,
                        typography, and nocturnal observation: warm parchment by day, deep
                        cosmic night skies by night, set in classic editorial serif
                        typography.
                    </p>
                </div>

                {/* Document Status */}
                <div
                    id="status"
                    className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10"
                >
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Document Maturity (Status)
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            How finished or developed a document is.
                        </p>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Inspired by Gwern.net, every essay carries a status tag indicating
                        its stage of editorial development:
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
                <div
                    id="confidence"
                    className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10"
                >
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
                            The confidence score reflects{" "}
                            <strong>my personal subjective degree of belief</strong> in the
                            central thesis of the essay given what I currently know. It is{" "}
                            <em>not</em> an assertion of objective consensus, mathematical
                            proof, or peer-reviewed finality.
                        </p>
                        <p className="text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-current/10">
                            Status and confidence are orthogonal: an essay can be a polished,
                            finished text while arguing for a highly speculative hypothesis
                            (low confidence), or an unpolished seed recording a fact known
                            with near-certainty.
                        </p>
                    </div>

                    <p className="text-sm leading-relaxed">
                        Probabilities are mapped using the Kesselman list of estimative
                        words adapted by Gwern:
                    </p>

                    <dl className="space-y-3.5 font-normal text-sm">
                        {Object.entries(CONFIDENCE_CONFIG).map(([key, config]) => (
                            <div key={key} className="space-y-1">
                                <dt className="font-mono text-xs font-medium text-[var(--text-color)] flex items-baseline justify-between">
                                    <span>{config.label}</span>
                                    <span className="text-[11px] font-mono text-[var(--text-color)]">
                                        {config.range}
                                    </span>
                                </dt>
                                <dd className="text-sm text-[var(--text-muted)] pl-3 border-l border-current/15 italic font-serif leading-relaxed">
                                    &ldquo;{config.desc}&rdquo;
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Revision History Philosophy */}
                <div
                    id="revisions"
                    className="space-y-4 scroll-mt-12 pt-6 border-t border-current/10"
                >
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-color)] font-semibold">
                            Revision History
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            Human intellectual changelog vs. Git commits.
                        </p>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)] font-serif">
                        Essays include an explicit revision log in the footer. Unlike Git
                        commits (which track typos, formatting, and mechanical refactors),
                        the revision history captures substantive intellectual shifts:
                        changes in evidence, updated arguments, or conceded counterpoints
                        over time.
                    </p>
                </div>
            </section>
        </div>
    );
}
