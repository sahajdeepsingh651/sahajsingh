import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const thoughtsDirectory = path.join(process.cwd(), "content/thoughts");

export interface ThoughtMeta {
    slug: string;
    title: string;
    date: string;
}

export interface ThoughtDetail extends ThoughtMeta {
    contentHtml: string;
}

export function getAllThoughts(): ThoughtMeta[] {
    if (!fs.existsSync(thoughtsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(thoughtsDirectory);
    const allThoughts = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(thoughtsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data } = matter(fileContents);

            return {
                slug,
                title: (data.title as string) || slug,
                date: data.date ? String(data.date) : "",
            };
        });

    // Sort descending by date
    return allThoughts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getThoughtBySlug(slug: string): Promise<ThoughtDetail | null> {
    const fullPath = path.join(thoughtsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const contentHtml = await marked.parse(content);

    return {
        slug,
        title: (data.title as string) || slug,
        date: data.date ? String(data.date) : "",
        contentHtml,
    };
}
