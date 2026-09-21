import Link from "next/link";
import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";

export const metadata: Metadata = {
    title: "Essays | Sahaj Singh",
    description: "Long-form inquiries into systems, foundations, and software craft.",
};

export default function EssaysPage() {
    const essays = getAllEssays();

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
                {essays.map((essay) => (
                    <li key={essay.slug} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <Link
                                    href={`/essays/${essay.slug}`}
                                    className="text-[16px] hover:underline underline-offset-4 decoration-current/40"
                                >
                                    {essay.title}
                                </Link>
                                {essay.status && (
                                    <span className="text-[11px] font-mono text-[var(--text-muted)] border border-current/15 px-1.5 py-0.2 rounded">
                                        {essay.status}
                                    </span>
                                )}
                            </div>
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
