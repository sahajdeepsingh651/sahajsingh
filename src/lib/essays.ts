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

export async function getEssayBySlug(
    slug: string,
): Promise<EssayDetail | null> {
    const fullPath = path.join(essaysDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Transform [^1] or [^alpha] footnote citations into clickable anchors
        const transformedContent = content.replace(
            /\[\^(\w+)\]/g,
            '<sup><a href="#ref-$1" id="cite-$1" class="citation-ref text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] underline-offset-2 hover:underline">[$1]</a></sup>'
        );

        const contentHtml = await marked.parse(transformedContent);
        const epistemic = parseEpistemicMeta(data);

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
