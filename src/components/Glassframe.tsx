"use client";

export default function GlassFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="page-canvas relative w-full max-w-6xl mx-auto my-8 px-6 sm:px-8 pt-6 sm:pt-8 pb-44 sm:pb-32 transition-all duration-300 z-10 border-none bg-transparent backdrop-blur-none">
            {children}
        </div>
    );
}
