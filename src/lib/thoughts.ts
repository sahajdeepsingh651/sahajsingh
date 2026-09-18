import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const thoughtsdir = path.join(process.cwd(), "content/thoughts");

export interface ThoughtMeta {
    slug: string;
    title: string;
    date: string;
}

export interface ThoughtDetail extends ThoughtMeta {
    contentHtml: string;
}

export function getAllThoughts(): ThoughtMeta[] {
    // 1. Guard check: folder might not exist yet
    if (!fs.existsSync(thoughtsdir)) {
        return [];
    }

    // 2. Read all filenames in the folder
    const filenames = fs.readdirSync(thoughtsdir);

    // 3. Keep only markdown files
    const filter_filenames = filenames.filter((element) =>
        element.endsWith(".md"),
    );

    // 4. Map each file to its metadata
    const allThoughts = filter_filenames.map((filename) => {
        const fullPath = path.join(thoughtsdir, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        // Turn "experiment.md" into slug "experiment"
        const slug = filename.replace(/\.md$/, "");

        return {
            slug,
            title: (data.title as string) || slug,
            date: data.date ? String(data.date) : "",
        };
    });

    // 5. Sort newest date first
    return allThoughts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getThoughtBySlug(
    slug: string,
): Promise<ThoughtDetail | null> {
    const fullPath = path.join(thoughtsdir, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const contentHtml = await marked.parse(content);
        return {
            slug,
            title: (data.title as string) || slug,
            date: data.date ? String(data.date) : "",

            contentHtml: contentHtml,
        };
    } else {
        return null;
    }
}
