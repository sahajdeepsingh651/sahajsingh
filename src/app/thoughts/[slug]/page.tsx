import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllThoughts, getThoughtBySlug } from "@/lib/thoughts";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const thoughts = getAllThoughts();
    return thoughts.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const thought = await getThoughtBySlug(slug);
    if (!thought) return { title: "Thought Not Found | Sahaj Singh" };
    return {
        title: `${thought.title} | Sahaj Singh`,
    };
}

export default async function ThoughtDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const thought = await getThoughtBySlug(slug);

    if (!thought) {
        notFound();
    }

    return (
        <article className="max-w-2xl space-y-8">
            {/* Back Link */}
            <div className="pt-2">
                <Link
                    href="/thoughts"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                >
                    ← back to [thoughts]
                </Link>
            </div>

            {/* Title & Metadata Header */}
            <header className="space-y-3 pb-6 border-b border-current/10">
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
                    {thought.title}
                </h1>
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                    <time>{thought.date}</time>
                    <span>•</span>
                    <span>thought</span>
                </div>
            </header>

            {/* Prose Content rendered from markdown */}
            <div
                className="prose-content space-y-4 leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:dark:border-stone-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-muted)] [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:pl-2 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:mt-6 [&_h2]:mb-2"
                dangerouslySetInnerHTML={{ __html: thought.contentHtml }}
            />
        </article>
    );
}
