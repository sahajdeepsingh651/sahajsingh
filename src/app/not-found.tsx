import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 Not Found | Sahaj Singh",
};

export default function NotFound() {
    return (
        <div className="space-y-6 w-full py-12">
            <div className="space-y-2 border-b border-current/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    404 — Coordinate Missing
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight">
                    Page Not Found
                </h1>
            </div>

            <p className="text-sm font-serif leading-relaxed text-[var(--text-muted)]">
                The document or coordinate you requested does not exist in this field notebook.
                It may have been moved, renamed, or remains an unwritten thought.
            </p>

            <div className="pt-2">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline underline-offset-4 transition-colors"
                >
                    ← return to [home]
                </Link>
            </div>
        </div>
    );
}
