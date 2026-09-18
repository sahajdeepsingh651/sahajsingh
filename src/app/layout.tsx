import type { Metadata } from "next";
import { Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import GlassFrame from "@/components/Glassframe";
import ThemeToggle from "@/components/Themetoggle";
import Navigation from "@/components/Navigation";
import SiteTitle from "@/components/SiteTitle";
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
    title: "Sahaj Singh",
    description: "Personal digital garden and field notebook",
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
                                <SiteTitle />
                            </div>
                            <Navigation />
                        </div>
                    </header>

                    <main className="flex-1">{children}</main>
                </GlassFrame>
            </body>
        </html>
    );
}
