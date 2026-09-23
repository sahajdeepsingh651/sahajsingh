import { getAllThoughts } from "@/lib/thoughts";
import Link from "next/link";

export default function ThoughtsPage() {
    const thoughts = getAllThoughts();

    return (
        <div className="space-y-10 max-w-2xl">
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">
                    Thoughts
                </h1>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                    rough thoughts about things that interest me
                </p>
            </header>

            <ul className="space-y-4">
                {thoughts.map((thought) => (
                    <li
                        key={thought.slug}
                        className="entry-row"
                    >
                        <Link
                            href={`/thoughts/${thought.slug}`}
                            className="entry-title text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40"
                        >
                            {thought.title}
                        </Link>
                        <span className="entry-date text-xs font-mono text-[var(--text-color)]">
                            {thought.date}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
