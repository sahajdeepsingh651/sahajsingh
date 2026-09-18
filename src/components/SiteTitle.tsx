"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteTitle() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    return (
        <Link href="/">
            <span className={isHome ? "opacity-100" : "opacity-0"}>[ </span>
            <span>Sahaj Singh </span>
            <span className={isHome ? "opacity-100" : "opacity-0"}>]</span>
        </Link>
    );
}
