"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteTitle() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      href="/"
      className="group text-xl sm:text-2xl font-normal tracking-tight no-underline inline-flex items-baseline"
    >
      <span
        className={`transition-opacity duration-200 select-none ${
          isHome ? "opacity-100 font-medium" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        [
      </span>
      <span className="mx-0.5">Sahaj Singh</span>
      <span
        className={`transition-opacity duration-200 select-none ${
          isHome ? "opacity-100 font-medium" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        ]
      </span>
    </Link>
  );
}
