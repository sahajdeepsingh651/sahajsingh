import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEssays, getEssayBySlug } from "@/lib/essays";
import { STATUS_CONFIG, CONFIDENCE_CONFIG } from "@/lib/metadata";
import EssayFooterExperiment from "@/components/EssayFooterExperiment";
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
        <div className="max-w-2xl space-y-8">
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
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[var(--text-muted)] pt-1">
                    <time>{essay.date}</time>
                    <span>•</span>
                    <span>essay</span>
                    {essay.status && (
                        <>
                            <span>•</span>
                            <span className="relative group inline-block">
                                <Link
                                    href="/about#status"
                                    className="hover:underline underline-offset-4"
                                >
                                    status:{" "}
                                    <span className="text-[var(--text-color)] italic font-serif">
                                        {STATUS_CONFIG[essay.status]?.label || essay.status}
                                    </span>
                                </Link>

                                {/* Small hover popup */}
                                <span className="pointer-events-none absolute left-0 top-full mt-2 z-20 w-64 p-2.5 rounded bg-[var(--bg-color)] border border-current/20 shadow-md text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                        Document Maturity
                                    </span>
                                    <span className="block font-serif text-[12px] text-[var(--text-color)] leading-snug">
                                        {STATUS_CONFIG[essay.status]?.desc}
                                    </span>
                                    <span className="block font-mono text-[10px] text-[var(--text-muted)] pt-1 mt-1 border-t border-current/10">
                                        Click to read status taxonomy →
                                    </span>
                                </span>
                            </span>
                        </>
                    )}
                    {essay.confidence && (
                        <>
                            <span>•</span>
                            <span className="relative group inline-block">
                                <Link
                                    href="/about#confidence"
                                    className="hover:underline underline-offset-4"
                                >
                                    confidence:{" "}
                                    <span className="text-[var(--text-color)] italic font-serif">
                                        {CONFIDENCE_CONFIG[essay.confidence]?.label || essay.confidence}
                                    </span>{" "}
                                    <span className="text-[var(--text-muted)] font-mono text-[11px]">
                                        ({CONFIDENCE_CONFIG[essay.confidence]?.range})
                                    </span>
                                </Link>

                                {/* Small hover popup */}
                                <span className="pointer-events-none absolute left-0 top-full mt-2 z-20 w-72 p-2.5 rounded bg-[var(--bg-color)] border border-current/20 shadow-md text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                        Personal Belief ({CONFIDENCE_CONFIG[essay.confidence]?.range})
                                    </span>
                                    <span className="block font-serif text-[12px] text-[var(--text-color)] leading-snug italic">
                                        &ldquo;{CONFIDENCE_CONFIG[essay.confidence]?.desc}&rdquo;
                                    </span>
                                    <span className="block font-mono text-[10px] text-[var(--text-muted)] pt-1 mt-1 border-t border-current/10">
                                        Click to read confidence scale →
                                    </span>
                                </span>
                            </span>
                        </>
                    )}
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

            {/* Essay Footer Experiment Component */}
            <EssayFooterExperiment
                modifications={essay.modifications}
                references={essay.references}
                originalUrl={essay.originalUrl}
            />
        </div>
    );
}
