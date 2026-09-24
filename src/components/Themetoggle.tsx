"use client";

export default function ThemeToggle() {
    function toggleTheme() {
        const isDark = document.documentElement.classList.contains("dark");
        const nextDark = !isDark;
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        // Force iOS Safari to immediately repaint the floating URL bar and expanded navigation chrome
        const newColor = nextDark ? "#0b0f17" : "#faf7ed";
        const scheme = nextDark ? "dark" : "light";
        document.documentElement.style.backgroundColor = newColor;
        document.documentElement.style.colorScheme = scheme;
        if (document.body) {
            document.body.style.backgroundColor = newColor;
            document.body.style.colorScheme = scheme;
        }
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "theme-color");
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", newColor);
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="relative w-[24px] h-[48px] cursor-pointer inline-flex items-center justify-center select-none group"
        >
            {/* Hand-drawn sketched vertical capsule border with parchment/cosmic fill */}
            <svg
                width="24"
                height="48"
                viewBox="0 0 24 48"
                className="absolute inset-0 text-stone-400/80 dark:text-stone-600 transition-colors group-hover:text-stone-600 dark:group-hover:text-stone-400"
            >
                <path
                    d="M 2,12 C 1.8,5 6.5,1.8 12,2 C 17.5,1.8 22.2,5.5 22,12 L 22,36 C 22.2,42.5 17.5,46.2 12,46 C 6.5,46.2 1.8,42.5 2,36 Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-[var(--bg-color)]"
                />
            </svg>

            {/* Sketched active indicator ring sliding vertically between Sun and Moon */}
            <div
                className="absolute top-[2px] left-[2px] w-[20px] h-[20px] transition-transform duration-300 ease-out translate-y-0 dark:translate-y-[24px]"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                        cx="10"
                        cy="10"
                        r="8.5"
                        className="fill-stone-900/10 dark:fill-stone-100/10 stroke-stone-800 dark:stroke-stone-200"
                        strokeWidth="1.1"
                        strokeDasharray="24 2"
                    />
                </svg>
            </div>

            {/* Hand-drawn Sun (Top) */}
            <div
                className="absolute top-[3px] left-[3px] w-[18px] h-[18px] flex items-center justify-center transition-opacity duration-200 opacity-100 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-60"
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="stroke-stone-900 dark:stroke-stone-300"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="8" cy="8" r="3" />
                    <line x1="8" y1="1" x2="8" y2="2.5" />
                    <line x1="8" y1="13.5" x2="8" y2="15" />
                    <line x1="1" y1="8" x2="2.5" y2="8" />
                    <line x1="13.5" y1="8" x2="15" y2="8" />
                    <line x1="3" y1="3" x2="4.2" y2="4.2" />
                    <line x1="11.8" y1="11.8" x2="13" y2="13" />
                    <line x1="3" y1="13" x2="4.2" y2="11.8" />
                    <line x1="11.8" y1="4.2" x2="13" y2="3" />
                </svg>
            </div>

            {/* Hand-drawn Moon (Bottom) */}
            <div
                className="absolute bottom-[3px] left-[3px] w-[18px] h-[18px] flex items-center justify-center transition-opacity duration-200 opacity-30 dark:opacity-100 group-hover:opacity-60 dark:group-hover:opacity-100"
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="stroke-stone-800 dark:stroke-stone-100"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M 12 2.8 C 8.2 3.3 5.8 6.8 6.3 10.5 C 6.8 12.8 8.6 14.2 11 14.2 C 5.8 14.6 2.5 10.5 3 6.2 C 3.4 2.8 6.2 1.5 9.5 1.5 C 10.4 1.5 11.2 1.8 12 2.8 Z" />
                    <path
                        d="M 12.5 5.5 L 13 6.8 L 14.2 7.2 L 13 7.6 L 12.5 8.9 L 12 7.6 L 10.8 7.2 L 12 6.8 Z"
                        className="fill-stone-800 dark:fill-stone-100"
                        stroke="none"
                    />
                </svg>
            </div>
        </button>
    );
}
