import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEssays, getEssayBySlug } from "@/lib/essays";
import EpistemicBadge from "@/components/EpistemicBadge";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const essays = getAllEssays();
    return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const essay = await getEssayBySlug(slug);

    if (!essay) {
        return {
            title: "Essay Not Found | Sahaj Singh",
        };
    }

    return {
        title: `${essay.title} | Sahaj Singh`,
        description: essay.description,
    };
}

export default async function EssayPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const essay = await getEssayBySlug(slug);

    if (!essay) {
        notFound();
    }

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
                    {essay.title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 pt-1">
                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                        <time>{essay.date}</time>
                        <span>•</span>
                        <span>essay</span>
                    </div>
                    <EpistemicBadge
                        status={essay.status}
                        confidence={essay.confidence}
                    />
                </div>
            </header>

            {/* Essay Content */}
            <article
                className="space-y-4 leading-relaxed font-normal
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_h2]:text-lg [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3
                    [&_h3]:text-base [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2
                    [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:dark:border-stone-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-muted)] [&_blockquote]:my-4
                    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:pl-2 [&_ul]:text-[var(--text-muted)] [&_ul]:my-4
                    [&_pre]:p-3.5 [&_pre]:rounded [&_pre]:bg-stone-100 [&_pre]:dark:bg-stone-900/80 [&_pre]:border [&_pre]:border-stone-200 [&_pre]:dark:border-stone-800 [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:my-4
                    [&_code]:font-mono [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-stone-200/60 [&_code]:dark:bg-stone-800
                    [&_pre_code]:bg-transparent [&_pre_code]:dark:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0
                    [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80"
                dangerouslySetInnerHTML={{ __html: essay.contentHtml }}
            />

            {/* Essay Footer: Revision History & Reference Link */}
            {(essay.modifications?.length || essay.originalUrl) && (
                <footer className="pt-8 mt-14 border-t border-current/10 space-y-6 text-xs font-mono text-[var(--text-muted)]">
                    {/* Revision History */}
                    {essay.modifications && essay.modifications.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-color)]">
                                Revision History
                            </h3>
                            <ul className="space-y-2.5">
                                {essay.modifications.map((mod, i) => (
                                    <li
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4"
                                    >
                                        <time className="shrink-0 text-[var(--text-color)]/80 font-mono">
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

                    {/* Original publication & references */}
                    {essay.originalUrl && (
                        <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p>
                                Originally published on{" "}
                                <a
                                    href={essay.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                                >
                                    Medium
                                </a>
                                .
                            </p>
                            <span className="text-[11px] opacity-60">
                                Field notebook port
                            </span>
                        </div>
                    )}
                </footer>
            )}
        </main>
    );
}
