export type DocumentStatus = "seed" | "draft" | "inprogress" | "finished";
export type EpistemicConfidence =
    | "certain"
    | "highly_likely"
    | "likely"
    | "possible"
    | "unlikely"
    | "highly_unlikely"
    | "remote"
    | "impossible";

export interface DocumentModification {
    date: string;
    note: string;
}

export interface EpistemicMeta {
    status?: DocumentStatus;
    confidence?: EpistemicConfidence;
    modifications?: DocumentModification[];
}

export const STATUS_CONFIG: Record<
    DocumentStatus,
    { label: string; desc: string }
> = {
    seed: {
        label: "seed",
        desc: "A collection of observations, links, fragments, questions, or rough thoughts.",
    },
    draft: {
        label: "draft",
        desc: "Has structure and communicates a coherent argument, but still incomplete.",
    },
    inprogress: {
        label: "in progress",
        desc: "Substantially developed; actively being expanded, researched, or refined.",
    },
    finished: {
        label: "finished",
        desc: "Considered complete for now; open to future revision upon new evidence.",
    },
};

export const CONFIDENCE_CONFIG: Record<
    EpistemicConfidence,
    { label: string; range: string; desc: string }
> = {
    certain: {
        label: "certain",
        range: "99%+",
        desc: "I consider the central thesis definitively true beyond reasonable doubt.",
    },
    highly_likely: {
        label: "highly likely",
        range: "71–85%",
        desc: "Given what I currently know, I believe the central claims are very strong.",
    },
    likely: {
        label: "likely",
        range: "56–70%",
        desc: "I currently believe the central claim is more likely than not, but substantial uncertainty remains.",
    },
    possible: {
        label: "possible",
        range: "46–55%",
        desc: "I assign roughly even odds; a plausible hypothesis I am actively exploring.",
    },
    unlikely: {
        label: "unlikely",
        range: "31–45%",
        desc: "I currently suspect the thesis is probably wrong, but valuable to record and explore.",
    },
    highly_unlikely: {
        label: "highly unlikely",
        range: "16–30%",
        desc: "Interesting speculation, but I personally consider it very improbable.",
    },
    remote: {
        label: "remote",
        range: "1–15%",
        desc: "I believe it is extremely unlikely, but worth preserving as an open boundary question.",
    },
    impossible: {
        label: "impossible",
        range: "<1%",
        desc: "I consider the thesis definitively ruled out based on current evidence.",
    },
};

export function parseEpistemicMeta(data: Record<string, unknown>): EpistemicMeta {
    const rawStatus = typeof data.status === "string" ? data.status.toLowerCase().replace(/[\s_-]+/g, "") : "";
    let status: DocumentStatus | undefined;
    if (rawStatus === "seed" || rawStatus === "draft" || rawStatus === "finished") {
        status = rawStatus;
    } else if (rawStatus === "inprogress" || rawStatus === "in_progress") {
        status = "inprogress";
    }

    const confidence = (
        typeof data.confidence === "string" && data.confidence in CONFIDENCE_CONFIG
            ? data.confidence
            : undefined
    ) as EpistemicConfidence | undefined;

    let modifications: DocumentModification[] | undefined;
    if (Array.isArray(data.modifications)) {
        modifications = data.modifications
            .filter((item): item is { date: unknown; note: unknown } => {
                return (
                    typeof item === "object" &&
                    item !== null &&
                    "date" in item &&
                    "note" in item
                );
            })
            .map((item) => ({
                date: String(item.date),
                note: String(item.note),
            }));
    }

    return {
        status,
        confidence,
        modifications,
    };
}

