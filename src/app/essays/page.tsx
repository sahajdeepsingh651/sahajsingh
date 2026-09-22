import Link from "next/link";
import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import { getHighlightedSlugs } from "@/lib/curation";

export const metadata: Metadata = {
    title: "Essays | Sahaj Singh",
    description: "Long-form inquiries into systems, foundations, and software craft.",
};

export default function EssaysPage() {
    const essays = getAllEssays();
    const highlighted = getHighlightedSlugs();

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
                {essays.map((essay) => {
                    const isHighlighted = highlighted.has(essay.slug);

                    return (
                        <li key={essay.slug} className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                <Link
                                    href={`/essays/${essay.slug}`}
                                    className="text-[16px] text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40 inline-flex items-baseline"
                                >
                                    {isHighlighted && (
                                        <span
                                            className="select-none text-[var(--text-muted)] mr-1.5 shrink-0"
                                            title="Recommended reading"
                                        >
                                            ※
                                        </span>
                                    )}
                                    <span>{essay.title}</span>
                                </Link>
                                <span className="text-xs font-mono text-[var(--text-color)] shrink-0">
                                    {essay.date}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                {essay.description}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
