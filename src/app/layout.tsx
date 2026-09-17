import type { Metadata } from "next";
import { Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GlassFrame from "@/components/Glassframe";
import ThemeToggle from "@/components/Themetoggle";

const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--font-newsreader",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "sahaj deep singh",
    description: "system explorer & programmer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${newsreader.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col font-serif">
                <GlassFrame>
                    {/* Hand-drawn switch button attached directly to the right border of GlassFrame */}
                    <div className="absolute right-2 md:-right-[12px] top-0 bottom-0 pointer-events-none z-30">
                        <div className="sticky top-20 sm:top-24 pointer-events-auto flex items-center justify-center">
                            <ThemeToggle />
                        </div>
                    </div>

                    <header className="pb-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4">
                            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                                <Link
                                    href="/"
                                    className="text-xl sm:text-2xl font-normal tracking-tight no-underline text-stone-900 dark:text-stone-100 hover:opacity-80 transition-opacity"
                                >
                                    sahaj deep singh
                                </Link>
                                <span className="text-sm text-stone-500 dark:text-stone-400 font-normal">
                                    system explorer & programmer
                                </span>
                            </div>

                            <nav className="flex items-center gap-6 sm:gap-7 text-[15px]">
                                <Link
                                    href="/projects"
                                    className="no-underline text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-100 transition-colors"
                                >
                                    projects
                                </Link>
                                <Link
                                    href="/now"
                                    className="no-underline text-stone-950 dark:text-stone-100 font-medium"
                                >
                                    [now]
                                </Link>
                                <Link
                                    href="/blog"
                                    className="no-underline text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-100 transition-colors"
                                >
                                    essays
                                </Link>
                                <Link
                                    href="/about"
                                    className="no-underline text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-100 transition-colors"
                                >
                                    about
                                </Link>
                            </nav>
                        </div>
                    </header>
                    <main className="flex-1">{children}</main>
                </GlassFrame>
            </body>
        </html>
    );
}
