import Link from "next/link";
import { getAllEssays } from "@/lib/essays";
import { getAllThoughts } from "@/lib/thoughts";
import { ALL_PROJECTS } from "@/lib/projects";
import HomeFeedExperiment from "@/components/HomeFeedExperiment";

export default function Home() {
    const essays = getAllEssays();
    const thoughts = getAllThoughts();

    return (
        <div className="space-y-12 max-w-2xl">
            <section className="space-y-4">
                <p className="leading-relaxed font-medium">
                    <span className="opacity-75 mr-2 select-none">※</span>I like to
                    understand things from first principles and find connections between
                    fundamental ideas across different domains.
                </p>
                <p className="leading-relaxed font-medium">
                    <span className="opacity-75 mr-2 select-none">※</span>
                    I&apos;m a software engineer by profession, deeply interested in
                    building reliable software systems.
                </p>
                <p className="text-xs font-mono text-[var(--text-muted)] pt-1">
                    More in{" "}
                    <Link
                        href="/now"
                        className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                    >
                        [now]
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/about"
                        className="underline underline-offset-4 hover:text-[var(--text-color)] transition-colors"
                    >
                        [about]
                    </Link>{" "}
                    →
                </p>
            </section>

            <HomeFeedExperiment
                essays={essays}
                projects={ALL_PROJECTS}
                thoughts={thoughts}
            />
        </div>
    );
}
