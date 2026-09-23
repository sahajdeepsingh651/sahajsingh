export interface Project {
    title: string;
    description: string;
    tech: string[];
    status: string;
    link?: string;
}

export const ALL_PROJECTS: Project[] = [
    {
        title: "Knowledge Engine",
        description:
            "Building a 3-tier AI knowledge engine that ingests raw documents, maps new resources directly to existing prerequisites and authoritative sources, and mathematically tracks user comprehension over time to turn passive reading into guaranteed technical expertise.",
        tech: ["python", "sqlite"],
        status: "seed",
        link: "https://github.com/sahajdeepsingh651/knowledge_engine",
    },
    {
        title: "Jscraper",
        description:
            "Developing a high-throughput, open-source web crawling and data aggregation tool in Go designed to ingest, filter, and process multi-domain job listings ",
        tech: ["Go"],
        status: "on hold",
        link: "https://github.com/sahajdeepsingh651/Jscrapper",
    },
    {
        title: "Orgbrain",
        description:
            "Developed an enterprise privacy and knowledge platform that stops confidential data and credentials from leaking into external AI models, while enabling engineering teams to safely share and discover solutions across sessions ",
        tech: ["Python", "Tailwind CSS", "React", "TypeScript"],
        status: "finished",
        link: "https://github.com/sahajdeepsingh651/Orgbrain",
    },
];
