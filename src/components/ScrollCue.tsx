"use client";

import { useEffect, useState } from "react";

export default function ScrollCue() {
    const [scrolled, setScrolled] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            const isScrollable =
                document.documentElement.scrollHeight > window.innerHeight + 80;
            setHasMoreContent(isScrollable);
            setScrolled(window.scrollY > 50);
        };

        checkScroll();
        window.addEventListener("scroll", checkScroll, { passive: true });
        window.addEventListener("resize", checkScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    if (!hasMoreContent) return null;

    const handleScrollDown = () => {
        window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" });
    };

    return (
        <aside
            aria-label="Scroll prompt"
            onClick={handleScrollDown}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-25 cursor-pointer transition-all duration-500 select-none ${
                scrolled ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
            }`}
        >
            <div className="px-3 py-1 rounded-full border border-current/15 bg-[var(--bg-color)]/80 backdrop-blur-sm text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-color)] hover:border-current/30 transition-all flex items-center gap-1.5 shadow-sm">
                <span className="inline-block animate-bounce text-[10px]">↓</span>
                <span>scroll for projects &amp; thoughts</span>
            </div>
        </aside>
    );
}
