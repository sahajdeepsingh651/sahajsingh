import type { Metadata, Viewport } from "next";
import { Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import GlassFrame from "@/components/Glassframe";
import ThemeToggle from "@/components/Themetoggle";
import Navigation from "@/components/Navigation";
import SiteTitle from "@/components/SiteTitle";
import HorizonForeground from "@/components/HorizonForeground";
import ScrollCue from "@/components/ScrollCue";

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
    title: {
        default: "Sahaj Singh",
        template: "%s | Sahaj Singh",
    },
    description: "Personal digital garden and field notebook",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${newsreader.variable} ${geistMono.variable} h-full antialiased`}
            data-page-align="left"
            data-entry-align="justified"
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var s=localStorage.getItem("theme");var h=new Date().getHours();var d=s?s==="dark":(h>=19||h<6);if(d){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}var c=d?"#0b0f17":"#faf7ed";document.documentElement.style.colorScheme=d?"dark":"light";document.documentElement.style.backgroundColor=c;document.querySelectorAll('meta[name="theme-color"]').forEach(function(el){el.remove();});var m=document.createElement("meta");m.setAttribute("name","theme-color");m.setAttribute("content",c);document.head.appendChild(m);}catch(e){}})();`,
                    }}
                />
                <link rel="preload" href="/real_read_mode.original.png" as="image" fetchPriority="high" />
                <link rel="preload" href="/real_write_mode.png" as="image" fetchPriority="high" />
                <link rel="preload" href="/horizon_foreground_light.png" as="image" fetchPriority="high" />
                <link rel="preload" href="/horizon_foreground_dark.png" as="image" fetchPriority="high" />
            </head>
            <body suppressHydrationWarning className="min-h-screen font-serif">
                <HorizonForeground />
                <GlassFrame>
                    {/* Hand-drawn switch button attached directly to the right border of GlassFrame */}
                    <div className="absolute right-2 md:-right-[12px] top-0 bottom-0 pointer-events-none z-30">
                        <div className="sticky top-20 sm:top-24 pointer-events-auto flex items-center justify-center">
                            <ThemeToggle />
                        </div>
                    </div>

                    <header className="pb-6 mb-8 w-full border-b border-current/10">
                        <div className="site-header-nav-row">
                            <div className="site-title-container shrink-0 flex items-baseline">
                                <SiteTitle />
                            </div>
                            <div className="site-nav-container shrink-0">
                                <Navigation />
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 content-box w-full" style={{ maxWidth: "var(--content-width, 896px)" }}>
                        {children}
                    </main>
                </GlassFrame>
                <ScrollCue />
            </body>
        </html>
    );
}
