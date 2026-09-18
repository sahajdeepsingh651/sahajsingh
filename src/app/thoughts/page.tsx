import Link from "next/link";
import type { Metadata } from "next";
import { getAllThoughts } from "@/lib/thoughts";

export const metadata: Metadata = {
    title: "Thoughts | Sahaj Singh",
    description: "Working notes, conjectures, and first-principle inquiries.",
};

export default function ThoughtsPage() {
    const thoughts = getAllThoughts();

    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">Thoughts</h1>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                    Working notes, conjectures, and first-principle observations.
                </p>
            </header>

            {/* Thoughts List */}
            {thoughts.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] italic">No thoughts recorded yet.</p>
            ) : (
                <ul className="space-y-6">
                    {thoughts.map((thought) => (
                        <li key={thought.slug} className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                <Link
                                    href={`/thoughts/${thought.slug}`}
                                    className="text-[16px] hover:underline underline-offset-4 decoration-current/40"
                                >
                                    {thought.title}
                                </Link>
                                <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">
                                    {thought.date}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
