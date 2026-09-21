import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Sahaj Singh",
    description: "Systems, autonomous tools, and software experiments by Sahaj Singh.",
};

interface Project {
    title: string;
    description: string;
    tech: string[];
    status: string;
    link?: string;
}

const PROJECTS: Project[] = [
    {
        title: "Knowledge Engine & Autonomous Crawler",
        description:
            "An answer to how to use AI for deep research and study rather than superficial summarization. Combines an autonomous web crawler written in Go with AST-based symbolic knowledge representations and local graph synthesis.",
        tech: ["Go", "Distributed Systems", "Networking", "ASTs"],
        status: "active build",
        link: "https://github.com/sahajdeepsingh651/knowledge_engine",
    },
    {
        title: "Personal Field Notebook & Digital Garden",
        description:
            "This atmospheric personal publishing platform. Inspired by Gwern.net, featuring estimative probability scales (Kesselman words), intellectual revision changelogs, bidirectional citations, and tactile editorial typography.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        status: "deployed",
        link: "https://github.com/sahajdeepsingh651/sahajsingh",
    },
    {
        title: "Endurance Conditioning & Event Protocol",
        description:
            "Empirical training telemetry, cadence protocols, and pacing frameworks designed for preparing for an upcoming Last Man Standing continuous ultra-endurance running event.",
        tech: ["Systems Thinking", "Empirical Metrics", "Athletics"],
        status: "training",
        link: "https://github.com/sahajdeepsingh651",
    },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <header className="space-y-2 pb-4 border-b border-current/10">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight">
                    Projects
                </h1>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                    Systems, autonomous tools, and software experiments.
                </p>
            </header>

            {/* Projects List */}
            <ul className="space-y-8">
                {PROJECTS.map((project) => (
                    <li key={project.title} className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            {project.link ? (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[16px] font-medium text-[var(--text-color)] hover:underline underline-offset-4 decoration-current/40 inline-flex items-center gap-1.5"
                                >
                                    <span>{project.title}</span>
                                    <span className="text-xs font-mono text-[var(--text-muted)]">
                                        ↗
                                    </span>
                                </a>
                            ) : (
                                <h2 className="text-[16px] font-medium text-[var(--text-color)]">
                                    {project.title}
                                </h2>
                            )}
                            <span className="text-xs font-mono text-[var(--text-color)] shrink-0">
                                [{project.status}]
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[var(--text-muted)] pt-0.5">
                            {project.tech.map((t) => (
                                <span key={t}>
                                    . {t}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
