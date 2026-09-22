import type { EssayMeta } from "@/lib/essays";

export interface CurationConfig {
    /**
     * Slugs of top essays featured on the homepage.
     * Order here dictates display order on the home feed.
     */
    showcase: string[];

    /**
     * Slugs of good essays you personally recommend to readers.
     */
    recommended: string[];
}

export const CURATION: CurationConfig = {
    showcase: [
        "knowledge-engines-and-first-principles",
        "beating-the-averages",
    ],
    recommended: [
        "knowledge-engines-and-first-principles",
    ],
};

/**
 * Returns an O(1) Set of all highlighted essay slugs:
 * Union of Showcase ∪ Recommended
 */
export function getHighlightedSlugs(): Set<string> {
    return new Set([...CURATION.showcase, ...CURATION.recommended]);
}

/**
 * Returns the exact showcase essays for the homepage,
 * gracefully falling back to newest published essays if fewer than target count.
 */
export function getHomepageEssays(allEssays: EssayMeta[], count = 3): EssayMeta[] {
    const showcaseSet = new Set(CURATION.showcase);

    // 1. Pick explicitly curated showcase essays in specified order
    const curated = CURATION.showcase
        .map((slug) => allEssays.find((e) => e.slug === slug))
        .filter((e): e is EssayMeta => Boolean(e));

    // 2. If fewer than target count, fill remainder with newest essays not already in showcase
    if (curated.length < count) {
        const remainder = allEssays.filter((e) => !showcaseSet.has(e.slug));
        curated.push(...remainder.slice(0, count - curated.length));
    }

    return curated.slice(0, count);
}
