import Link from "next/link";
import { DocumentModification } from "@/lib/metadata";
import { EssayReference } from "@/lib/essays";

interface EssayFooterProps {
    modifications?: DocumentModification[];
    references?: EssayReference[];
    originalUrl?: string;
}

export default function EssayFooter({
    modifications = [],
    references = [],
    originalUrl,
}: EssayFooterProps) {
    if (modifications.length === 0 && references.length === 0 && !originalUrl) {
        return null;
    }

    return (
        <footer className="pt-8 mt-14 border-t border-current/10 space-y-8 text-xs font-mono text-[var(--text-muted)]">
            {/* Revision History */}
            {modifications.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-current/10 pb-1.5">
                        <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                            Revision History
                        </h3>
                        <Link
                            href="/about#revisions"
                            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline underline-offset-2"
                        >
                            about changelog →
                        </Link>
                    </div>
                    <ul className="space-y-2.5">
                        {modifications.map((mod, i) => (
                            <li
                                key={i}
                                className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4"
                            >
                                <time className="shrink-0 text-[var(--text-muted)] font-mono">
                                    {mod.date}
                                </time>
                                <span className="font-serif text-[13px] text-[var(--text-muted)] leading-relaxed">
                                    {mod.note}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Annotated Bibliography (Ledger Standard) */}
            {references.length > 0 && (
                <section className="space-y-4">
                    <div className="border-b border-current/10 pb-1.5">
                        <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                            References & Annotations
                        </h3>
                    </div>
                    <ol className="space-y-4 list-none">
                        {references.map((ref) => (
                            <li
                                key={ref.id}
                                id={`ref-${ref.id}`}
                                className="group space-y-1 pl-3 border-l-2 border-current/15 hover:border-current/40 transition-colors scroll-mt-14"
                            >
                                <div className="flex items-baseline justify-between gap-2">
                                    <div className="font-serif text-[14px] text-[var(--text-color)]">
                                        <span className="font-mono text-xs text-[var(--text-muted)] mr-1.5">
                                            [{ref.id}]
                                        </span>
                                        {ref.url ? (
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline underline-offset-4 decoration-current/40"
                                            >
                                                {ref.title}
                                            </a>
                                        ) : (
                                            <span>{ref.title}</span>
                                        )}
                                        {ref.author && (
                                            <span className="text-[var(--text-muted)] text-[13px]">
                                                {" "}— {ref.author}
                                            </span>
                                        )}
                                        {ref.date && (
                                            <span className="font-mono text-xs text-[var(--text-muted)]">
                                                {" "}({ref.date})
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={`#cite-${ref.id}`}
                                        title="Jump back to citation in text"
                                        className="text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline font-mono text-xs shrink-0"
                                    >
                                        ↩
                                    </a>
                                </div>
                                {ref.note && (
                                    <p className="font-serif text-[12px] italic text-[var(--text-muted)] leading-relaxed pl-5">
                                        {ref.note}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {/* Colophon & Original Link */}
            {originalUrl && (
                <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <p>
                        Originally published on{" "}
                        <a
                            href={originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                        >
                            Medium
                        </a>
                        .
                    </p>
                    <span className="text-[11px] text-[var(--text-muted)]">
                        Permanent field notebook archive
                    </span>
                </div>
            )}
        </footer>
    );
}
