import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'My views on "Beating the Averages" by Paul Graham | Sahaj Singh',
    description:
        'My views on "Beating the Averages" by Paul Graham. Reflections on Lisp, homoiconicity, macros, and strategic advantages.',
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
                    <span>Jun 26, 2025</span>
                    <span>·</span>
                    <span>4 min read</span>
                </div>
            </header>

            {/* Essay Body — 100% Verbatim Original Text */}
            <article className="space-y-6 leading-relaxed">
                <p>
                    Read his essay if you haven&apos;t:{" "}
                    <a
                        href="https://paulgraham.com/avg.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:opacity-80"
                    >
                        Beating the Averages
                    </a>
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    You Don&apos;t Beat the Average by Playing It Safe
                </h2>
                <p>
                    If you want to gain a substantial advantage over your competitors, you need to do something different.
                    This whole point will be emphasized more by telling you guys more about the startup &ldquo;Viaweb&rdquo;.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Viaweb</h2>
                <p>
                    Viaweb was originally started by Paul Graham and Robert Morris. Trevor Blackwell joined them later.
                    It rendered websites dynamically on the server, unlike typical client-side approaches of the time.
                    This approach removed the dependency on the client-side tech stack, allowing them to use any language they preferred.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">The Blub Paradox</h2>
                <p>
                    Paul introduces the Blub paradox that explains that a normal programmer will not know what features he is missing,
                    since he is thinking the whole software in his own programming language. He won&apos;t understand the power of macros
                    or what features he is missing that make software more useful and elegant that can be achieved by adopting some other language.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">
                    Why Lisp ? why go to some uncharted Land of Lisp?
                </h2>
                <p>
                    Lisp (short for LISt Processing) is one of the oldest high-level programming languages, invented by John McCarthy in 1958.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Why to use Lisp</h2>

                <h3 className="text-base font-medium tracking-tight pt-2">Code as Data</h3>
                <p>
                    In Lisp, code is written using the same structures that are used for regular data. This idea is called homoiconicity.
                </p>
                <p>
                    Homoiconic means the primary representation of code is also a data structure in the language itself.
                </p>
                <p>So in Lisp:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[var(--text-muted)]">
                    <li>Code is data</li>
                    <li>And data can be used as code</li>
                </ul>
                <p>
                    In Lisp, code and data both are represented using an Abstract Syntax Tree (AST). This allows code to be passed as an
                    argument — which introduces the concept of macros. Since code is written in AST, you don&apos;t need a parser to parse
                    your code, which you would need in other languages.
                </p>
                <p>You don&apos;t need a separate mechanism to handle code.</p>
                <p>
                    The same tools you use for data — like <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">car</code>,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">cdr</code>,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">list</code>,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">subst</code>,{" "}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">mapcar</code> — can be used
                    to inspect, transform, and generate code.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Example 1: If Statement</h2>
                <div className="space-y-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">As Code</p>
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`(if (> x 0)
    (print "positive")
    (print "non-positive"))`}
                    </pre>

                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] pt-2">As Data (Quoted List)</p>
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`'(if (> x 0)
      (print "positive")
      (print "non-positive"))`}
                    </pre>
                </div>
                <p>
                    The only difference in syntax is the presence of the &apos; (quote), which tells Lisp to treat the expression as data rather than executing it.
                </p>
                <p>
                    Since Code and data are treated as same. You can pass code as arguments from there concept of macros has come
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Macros</h2>
                <p>
                    <strong>Macros are powerful tools using which you can generate code from code!!</strong>
                </p>
                <p>Yes, generating code from code seems like a weird idea.</p>
                <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`;THIS is the macros for creating unless control structure

(defmacro unless (condition body)
  \`(if (not ,condition)
       ,body))`}
                </pre>
                <p>
                    The <code className="font-mono text-xs">unless</code> macro takes a condition and a body of code, and expands into an <code className="font-mono text-xs">if</code> statement that runs the body only if the condition is false—in other words, &ldquo;do this unless the condition is true.&rdquo;
                </p>
                <p>
                    This block of code may seem just like a function — you take some arguments and you get some value in return — but it&apos;s different. You are passing Code in the arguments and getting code as output which will replace macro in compiler phase
                </p>

                <div className="space-y-2">
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`;block a
(unless (> x 10)
 (print "x is not greater than 10"))`}
                    </pre>
                    <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`;block b
(if (not (> x 10))
 (print "x is not greater than 10"))`}
                    </pre>
                </div>
                <p>block a code will be replaced by block b code in the compiler phase.</p>

                <h2 className="text-lg font-medium tracking-tight pt-4">Macro vs Function in Lisp</h2>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[var(--text-muted)]">
                    <li>A <strong>function</strong> <em>evaluates</em> all its arguments before executing.</li>
                    <li>A <strong>macro</strong> works at the <strong>code level</strong>: it gets the <strong>code itself</strong> (unevaluated), and returns new code to run.</li>
                </ul>

                <p>For example:</p>
                <pre className="p-3.5 rounded bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-xs font-mono overflow-x-auto">
{`function(x>0 ,do_something,do_something_else)`}
                </pre>
                <p>
                    In this function, all arguments(x&gt;0 ,do_something,do_something_else) get executed, even if you need them or not.
                </p>
                <p>
                    So the ability to control your execution can introduce new control flow in the program.
                </p>
                <p>
                    If you look at the &ldquo;unless&rdquo; macro, it is just <code className="font-mono text-xs">if</code> and <code className="font-mono text-xs">not</code> combined together — this can be achieved in other languages also.
                </p>
                <p>
                    But <strong>things like changing the execution depending on how many times a block of code has run</strong> can be done, which can&apos;t be done naturally in other languages.
                </p>
                <p>
                    In Lisp, you are <strong>transforming code before it runs</strong>.
                </p>
                <p>
                    In future, I will go more deeply into how Lisp is different from other languages.
                </p>
                <p>
                    I&apos;ll dive deeper into these macro patterns — like <strong>backtracking, reactive triggers, and coroutines</strong> — in upcoming sections, which are difficult to express together in most conventional programming languages without building complex frameworks or interpreters.
                </p>
                <p>
                    <strong>Things which are unique to one language can be created in Lisp</strong>, that is why Lisp is called <em>&ldquo;a language that can create other languages.&rdquo;</em>
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">So I will summarize Macros:</h2>
                <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 italic text-[var(--text-muted)] my-4">
                    <strong><em>Macros are powerful tools that generate and manipulate code in compile time — meaning you are writing code in the compile-time phase.</em></strong>
                </blockquote>

                <h2 className="text-lg font-medium tracking-tight pt-4">Why is it not so widely used?</h2>
                <p>
                    Learning a new programming language is learning a <strong>new way to think</strong> about the solution of problems. Each programming language comes with its own way to think — which we can call a <strong>programming paradigm</strong>
                </p>
                <p>
                    (I will explain programming paradigms more extensively in my coming blogs).
                </p>
                <p>
                    Programming revolution and hardware revolution have not grown at the same rate of growth. It takes time to change habits of mind.
                </p>

                <h2 className="text-lg font-medium tracking-tight pt-4">The Strategic Advantage and Disadvantage</h2>

                <h3 className="text-base font-medium tracking-tight pt-2">Advantage</h3>
                <p>
                    The advantage is your competitor won&apos;t understand how you are developing your software so fast.
                </p>
                <p>
                    This is evident in Paul&apos;s essay when he was talking about his startup days.
                </p>
                <p>
                    They were able to copy competitors&apos; features within <strong>days only</strong>.
                </p>
                <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 italic text-[var(--text-muted)] my-2">
                    <em>(Note — I still have to understand more about Lisp — what more you can do instead of developing your own domain-specific language and building complex dynamic systems fast.)</em>
                </blockquote>

                <h3 className="text-base font-medium tracking-tight pt-2">Disadvantage</h3>
                <p>
                    It is difficult to find programmers who still use Lisp, since it is the <strong>second-oldest high-level programming language</strong> still in use today (after <strong>Fortran</strong>).
                </p>
                <p>
                    This makes collaboration with others more challenging.
                </p>
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
