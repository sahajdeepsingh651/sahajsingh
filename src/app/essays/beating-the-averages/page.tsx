import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'My views on "Beating the Averages" by Paul Graham | Sahaj Singh',
    description:
        "Reflections on Paul Graham's classic essay, Lisp, homoiconicity, macros, and gaining a strategic advantage through expressive languages.",
};

export default function BeatingTheAveragesPage() {
    return (
        <main className="max-w-2xl space-y-8">
            {/* Back Navigation */}
            <div>
                <Link
                    href="/essays"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                >
                    ← back to [essays]
                </Link>
            </div>

            {/* Essay Header */}
            <header className="space-y-3 pb-6 border-b border-current/10">
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
                    My views on &ldquo;Beating the Averages&rdquo; by Paul Graham
                </h1>
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                    <span>2025-06-26</span>
                    <span>·</span>
                    <span>4 min read</span>
                    <span>·</span>
                    <span>Lisp &amp; Architecture</span>
                </div>
            </header>

            {/* Essay Body */}
            <article className="space-y-6 leading-relaxed">
                <p>
                    If you haven&apos;t read Paul Graham&apos;s original essay, I highly
                    recommend starting there:{" "}
                    <a
                        href="https://paulgraham.com/avg.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:opacity-80"
                    >
                        Beating the Averages (April 2001)
                    </a>
                    .
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    You Don&apos;t Beat the Average by Playing It Safe
                </h2>
                <p>
                    If you want to gain a substantial advantage over your competitors, you
                    need to do something fundamentally different. This point becomes vivid
                    when examining the story of Viaweb.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Viaweb</h2>
                <p>
                    Viaweb was originally founded by Paul Graham and Robert Morris, later
                    joined by Trevor Blackwell. Crucially, Viaweb rendered e-commerce
                    websites dynamically on the server—an unconventional choice
                    contrasting with typical client-heavy approaches of the era.
                </p>
                <p>
                    Running server-side emancipated them from client runtime constraints,
                    unlocking the freedom to write their platform in whatever language
                    gave them maximum leverage: Common Lisp.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    The Blub Paradox
                </h2>
                <p>
                    Graham formulated the <em>Blub Paradox</em> to explain why programmers
                    often fail to see the shortcomings of their current tools. When a
                    programmer thinks in language &ldquo;Blub,&rdquo; they look down the
                    power spectrum and easily identify features missing in weaker
                    languages.
                </p>
                <p>
                    However, when looking up the power spectrum toward more expressive
                    languages, the Blub programmer cannot fathom what they are missing.
                    They dismiss higher abstractions as weird, superfluous, or
                    esoteric—blind to the compounding leverage of macros and
                    homoiconicity.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    Why Lisp? Why Venture into Uncharted Territory?
                </h2>
                <p>
                    Lisp (short for <em>LISt Processing</em>) is one of the oldest
                    high-level programming languages, invented by John McCarthy in 1958.
                    Its enduring power stems from a single foundational insight:
                    <strong> homoiconicity</strong>.
                </p>

                <h3 className="text-base font-medium tracking-tight pt-2">
                    Code as Data
                </h3>
                <p>
                    In Lisp, code is written using the exact same structures used for
                    regular data. The syntax of the language directly mirrors its Abstract
                    Syntax Tree (AST).
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[var(--text-muted)]">
                    <li>Code is data.</li>
                    <li>Data can be executed as code.</li>
                </ul>
                <p>
                    Because code is represented as native lists, you don&apos;t need a
                    distinct parser or meta-compiler to manipulate logic. The same
                    primitives you use to transform data—
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
                        car
                    </code>
                    ,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
                        cdr
                    </code>
                    ,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
                        list
                    </code>
                    ,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
                        mapcar
                    </code>
                    —can inspect, transform, and synthesize new program logic.
                </p>

                <div className="space-y-2 pt-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        As Code (Executable):
                    </p>
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
                        {`(if (> x 0)\n    (print "positive")\n    (print "non-positive"))`}
                    </pre>

                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] pt-2">
                        As Data (Quoted List):
                    </p>
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
                        {`'(if (> x 0)\n      (print "positive")\n      (print "non-positive"))`}
                    </pre>
                </div>
                <p>
                    The sole difference is the apostrophe (
                    <code className="font-mono text-xs">&apos;</code>), which instructs
                    the reader to treat the form as raw data rather than evaluating it
                    immediately.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    Macros: Generating Code from Code
                </h2>
                <p>
                    Because code is represented as data, functions can accept code as
                    arguments and generate new code at compile-time. This is the realm of
                    Lisp macros:
                </p>
                <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
                    {`; Creating the 'unless' control structure\n(defmacro unless (condition body)\n  \`(if (not ,condition)\n       ,body))`}
                </pre>
                <p>
                    The <code className="font-mono text-xs">unless</code> macro receives a
                    condition and body unevaluated, rewriting it into an inverted{" "}
                    <code className="font-mono text-xs">if</code> expression before
                    compilation.
                </p>

                <h3 className="text-base font-medium tracking-tight pt-2">
                    Macro vs Function
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-[var(--text-muted)]">
                    <li>
                        <strong className="text-[var(--text-color)]">A Function</strong>{" "}
                        evaluates all arguments eagerly prior to executing its body.
                    </li>
                    <li>
                        <strong className="text-[var(--text-color)]">A Macro</strong>{" "}
                        operates directly on unevaluated source forms during compilation,
                        expanding into new code to run.
                    </li>
                </ul>
                <p>
                    This capacity enables programmers to sculpt bespoke control
                    flows—pattern matching, backtracking, coroutines, or domain-specific
                    languages—without waiting for language committees or patching external
                    compilers.
                </p>

                <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 italic text-[var(--text-muted)] my-6">
                    &ldquo;Macros are powerful tools that generate and manipulate code at
                    compile time—enabling you to write programs that write
                    programs.&rdquo;
                </blockquote>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    The Strategic Calculus
                </h2>
                <div className="space-y-3">
                    <p>
                        <strong>The Advantage:</strong> Speed of iteration. In Viaweb&apos;s
                        early days, when competitors announced new features, Graham and
                        Morris were frequently able to replicate and deploy counter-features
                        within a single day. The competitor couldn&apos;t comprehend how
                        Viaweb moved so quickly.
                    </p>
                    <p>
                        <strong>The Trade-off:</strong> Talent scarcity and ecosystem
                        ergonomics. Finding engineers fluent in Lisp remains challenging,
                        making traditional team scaling more demanding than in conventional
                        ecosystems.
                    </p>
                </div>
            </article>

            {/* Colophon & Original Archive Link */}
            <footer className="pt-8 mt-12 border-t border-current/10 text-xs font-mono text-[var(--text-muted)]">
                <p>
                    Originally published on{" "}
                    <a
                        href="https://medium.com/@sahajdeepsingh100/my-views-on-beating-the-averages-by-paul-graham-f6320333ef0f"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                    >
                        Medium
                    </a>{" "}
                    on June 26, 2025.
                </p>
            </footer>
        </main>
    );
}
