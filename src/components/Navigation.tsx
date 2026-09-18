"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/projects", label: "projects" },

    { href: "/now", label: "now" },
    { href: "/essays", label: "essays" },
    { href: "/thoughts", label: "thoughts" },
    { href: "/about", label: "about" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-6 sm:gap-7 text-[15px]">
            {NAV_ITEMS.map(({ href, label }) => {
                const isActive =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href + "/"));
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`no-underline transition-all ${isActive
                                ? "font-medium text-[var(--text-color)]"
                                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:underline underline-offset-4"
                            }`}
                    >
                        {isActive ? `[${label}]` : label}
                    </Link>
                );
            })}
        </nav>
    );
}
