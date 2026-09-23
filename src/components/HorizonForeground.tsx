export default function HorizonForeground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden"
        >
            {/* Light mode foreground horizon (sea, waves, rocks, lighthouse) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/horizon_foreground_light.png"
                alt=""
                fetchPriority="high"
                decoding="sync"
                className="dark:hidden fixed inset-0 w-full h-full object-cover object-[70%_bottom] md:object-bottom md:h-auto md:top-auto md:bottom-0 pointer-events-none select-none"
            />
            {/* Dark mode foreground horizon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/horizon_foreground_dark.png"
                alt=""
                fetchPriority="high"
                decoding="sync"
                className="hidden dark:block fixed inset-0 w-full h-full object-cover object-[70%_bottom] md:object-bottom md:h-auto md:top-auto md:bottom-0 pointer-events-none select-none"
            />
        </div>
    );
}
