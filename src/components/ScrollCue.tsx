"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollCue() {
    const pathname = usePathname();
    const isEssay = pathname?.startsWith("/essays");
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        if (!isEssay) return;

        const checkScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;

            const pct = maxScroll > 0 ? Math.min(100, Math.round((currentScroll / maxScroll) * 100)) : 0;
            setScrollPercent(pct);
        };

        checkScroll();
        window.addEventListener("scroll", checkScroll, { passive: true });
        window.addEventListener("resize", checkScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [isEssay]);

    // Keep scroll indicator strictly inside essays only
    if (!isEssay) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-current/5"
        >
            <div
                className="h-full bg-[var(--heading-color)] opacity-70 origin-left"
                style={{
                    transform: `scaleX(${scrollPercent / 100})`,
                }}
            />
        </div>
    );
}
