import Link from "next/link";
import { getThoughtBySlug } from "@/lib/thoughts";

export default async function ThoughtPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const thought = getThoughtBySlug();
}
