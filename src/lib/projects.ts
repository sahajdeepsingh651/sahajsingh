export interface Project {
    title: string;
    description: string;
    tech: string[];
    status: string;
    link?: string;
}

export const ALL_PROJECTS: Project[] = [
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
