"use client";
import { useState, useEffect } from "react";
export default function GlassFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div
            className={`relative w-full max-w-6xl mx-auto my-8 p-8 border border-current/10 rounded-sm transition-all duration-500 ${
                isScrolled
                    ? "bg-[var(--bg-color)]/70 backdrop-blur-md"
                    : "bg-transparent backdrop-blur-none"
            }`}
        >
            {children}
        </div>
    );
}
