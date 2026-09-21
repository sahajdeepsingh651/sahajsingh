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

export interface EssayMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    originalUrl?: string;
    status?: DocumentStatus;
    confidence?: EpistemicConfidence;
    modifications?: DocumentModification[];
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
        const contentHtml = await marked.parse(content);
        const epistemic = parseEpistemicMeta(data);

        return {
            slug,
            title: (data.title as string) || slug,
            date: data.date ? String(data.date) : "",
            description: (data.description as string) || "",
            originalUrl: data.originalUrl as string | undefined,
            contentHtml,
            ...epistemic,
        };
    } else {
        return null;
    }
}
