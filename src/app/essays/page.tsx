import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Essays | Sahaj Singh",
    description: "Long-form inquiries into systems, foundations, and software craft.",
};

interface Essay {
    slug: string;
    title: string;
    date: string;
    description: string;
}

const ESSAYS: Essay[] = [
    {
        slug: "beating-the-averages",
        title: 'My views on "Beating the Averages" by Paul Graham',
        date: "2025-06-26",
        description:
            "On Lisp, homoiconicity, macros, and why expressive languages offer an asymmetric competitive advantage.",
    },
];

export default function EssaysPage() {
    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">Essays</h1>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                    Long-form inquiries into systems, computing, and first principles.
                </p>
            </header>

            {/* Essays List */}
            <ul className="space-y-6">
                {ESSAYS.map((essay) => (
                    <li key={essay.slug} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <Link
                                href={`/essays/${essay.slug}`}
                                className="text-[16px] hover:underline underline-offset-4 decoration-current/40"
                            >
                                {essay.title}
                            </Link>
                            <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">
                                {essay.date}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            {essay.description}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
