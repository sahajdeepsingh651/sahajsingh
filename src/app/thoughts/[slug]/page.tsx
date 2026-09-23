import Link from "next/link";
import { getThoughtBySlug } from "@/lib/thoughts";
import { notFound } from "next/navigation";
import { getAllThoughts } from "@/lib/thoughts";

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
    if (!thought) {
        return {
            title: "Thought Not Found | Sahaj Singh",
        };
    }
    return {
        title: `${thought.title} | Sahaj Singh`,
        description: "Field notebook thought entry.",
    };
}

export default async function ThoughtPage({
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
        <div className="space-y-8 w-full">
            <div>
                <Link
                    href="/thoughts"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                >
                    ← back to [thoughts]
                </Link>
            </div>
            <header className="space-y-3 pb-6 border-b border-current/10">
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
                    {thought.title}
                </h1>
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-color)]">
                    <time>{thought.date}</time>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="text-[var(--text-muted)]">thought</span>
                </div>
            </header>
            <article className="space-y-6 leading-relaxed">
                <div
                    dangerouslySetInnerHTML={{
                        __html: thought.contentHtml,
                    }}
                />
            </article>
        </div>
    );
}
