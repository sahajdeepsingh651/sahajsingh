/* eslint-disable @next/next/no-img-element */
export default function HorizonForeground() {
    // Both background illustration and foreground wave cutout are anchored
    // strictly to the bottom of the viewport with natural aspect ratio.
    // They share identical layout (bottom-0 left-0 w-full h-auto), eliminating drift permanently.
    const sharedImgClasses =
        "w-full h-full object-cover object-[70%_bottom] md:object-bottom pointer-events-none select-none";

    return (
        <>
            {/* Layer 0: Sky, stars, and landscape background (fixed, z-0) */}
            <div
                aria-hidden="true"
                className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden"
            >
                <img
                    src="/real_read_mode.original.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`dark:hidden ${sharedImgClasses}`}
                />
                <img
                    src="/real_write_mode.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`hidden dark:block ${sharedImgClasses}`}
                />
            </div>

            {/* Layer 2: Foreground coastal waves (fixed, z-20) */}
            {/* Content at z-10 emerges from behind these waves as the user scrolls */}
            <div
                aria-hidden="true"
                className="fixed inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
            >
                <img
                    src="/horizon_foreground_light.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`dark:hidden ${sharedImgClasses}`}
                />
                <img
                    src="/horizon_foreground_dark.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`hidden dark:block ${sharedImgClasses}`}
                />
            </div>

            {/* Layer 1.5: Solid mobile ocean base (fixed, z-[15]) */}
            {/* Dynamically matches safe-area + bar height, staying submerged under waves on all devices */}
            <div
                aria-hidden="true"
                className="fixed bottom-0 left-0 right-0 h-[calc(env(safe-area-inset-bottom,0px)+46px)] bg-[var(--bg-color)] pointer-events-none z-[15] select-none md:hidden"
            />
        </>
    );
}
