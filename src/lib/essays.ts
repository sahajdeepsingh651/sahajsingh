import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import {
    DocumentStatus,
    EpistemicConfidence,
    DocumentModification,
    parseEpistemicMeta,
} from "./metadata";

const essaysDirectory = path.join(process.cwd(), "content/essays");

export interface EssayReference {
    id: string | number;
    title: string;
    author?: string;
    url?: string;
    date?: string;
    note?: string;
}

export interface EssayMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    originalUrl?: string;
    status?: DocumentStatus;
    confidence?: EpistemicConfidence;
    modifications?: DocumentModification[];
    references?: EssayReference[];
}

export interface EssayDetail extends EssayMeta {
    contentHtml: string;
}

export function getAllEssays(): EssayMeta[] {
    if (!fs.existsSync(essaysDirectory)) {
        return [];
    }

    const filenames = fs.readdirSync(essaysDirectory);
    const mdFiles = filenames.filter((file) => file.endsWith(".md"));

    const allEssays = mdFiles.map((filename) => {
        const fullPath = path.join(essaysDirectory, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        const slug = filename.replace(/\.md$/, "");
        const epistemic = parseEpistemicMeta(data);

        return {
            slug,
            title: (data.title as string) || slug,
            date: data.date ? String(data.date) : "",
            description: (data.description as string) || "",
            originalUrl: data.originalUrl as string | undefined,
            ...epistemic,
        };
    });

    // Sort newest date first
    return allEssays.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function getEssayBySlug(
    slug: string,
): Promise<EssayDetail | null> {
    const fullPath = path.join(essaysDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        const references: EssayReference[] = Array.isArray(data.references)
            ? data.references.map((ref: Record<string, unknown>, idx: number) => ({
                  id: ref.id != null ? String(ref.id) : String(idx + 1),
                  title: String(ref.title || ""),
                  author: ref.author ? String(ref.author) : undefined,
                  url: ref.url ? String(ref.url) : undefined,
                  date: ref.date ? String(ref.date) : undefined,
                  note: ref.note ? String(ref.note) : undefined,
              }))
            : [];

        const refMap = new Map<string, EssayReference>();
        references.forEach((ref) => {
            refMap.set(String(ref.id), ref);
        });

        // Transform [^1] or [^alpha] footnote citations into clickable anchors with hover preview
        const transformedContent = content.replace(
            /\[\^(\w+)\]/g,
            (match, id) => {
                const ref = refMap.get(id);
                if (!ref) {
                    return `<sup><a href="#ref-${id}" id="cite-${id}" class="citation-ref text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] underline-offset-2 hover:underline">[${id}]</a></sup>`;
                }

                const authorYear = [
                    ref.author,
                    ref.date ? `(${ref.date})` : null,
                ]
                    .filter(Boolean)
                    .join(" ");

                const noteHtml = ref.note
                    ? `<span class="block text-[12px] font-serif italic text-[var(--text-muted)] leading-relaxed mt-1.5 pt-1.5 border-t border-current/10">${escapeHtml(ref.note)}</span>`
                    : "";

                return `<span class="citation-wrapper relative inline-block group"><sup class="select-none"><a href="#ref-${id}" id="cite-${id}" class="citation-ref text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] underline-offset-2 hover:underline">[${id}]</a></sup><span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-72 max-w-[85vw] p-3 rounded-md bg-[var(--bg-color)] border border-current/20 shadow-xl text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 normal-case not-italic font-sans"><span class="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Reference [${id}]</span><span class="block font-serif text-[13px] font-medium text-[var(--text-color)] leading-snug">${escapeHtml(ref.title)}</span>${authorYear ? `<span class="block text-[11px] font-mono text-[var(--text-muted)] mt-0.5">${escapeHtml(authorYear)}</span>` : ""}${noteHtml}</span></span>`;
            }
        );

        const contentHtml = await marked.parse(transformedContent);
        const epistemic = parseEpistemicMeta(data);

        return {
            slug,
            title: (data.title as string) || slug,
            date: data.date ? String(data.date) : "",
            description: (data.description as string) || "",
            originalUrl: data.originalUrl as string | undefined,
            contentHtml,
            references,
            ...epistemic,
        };
    } else {
        return null;
    }
}
