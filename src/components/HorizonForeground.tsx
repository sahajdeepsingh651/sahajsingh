/* eslint-disable @next/next/no-img-element */
export default function HorizonForeground() {
    // Both background illustration and foreground wave cutout are anchored
    // strictly to the bottom of the viewport with natural aspect ratio.
    // They share identical layout (bottom-0 left-0 w-full h-auto), eliminating drift permanently.
    const sharedImgClasses =
        "w-full h-auto pointer-events-none select-none block";

    return (
        <>
            {/* Layer 0: Sky, lighthouse & horizon background (fixed at bottom, z-0) */}
            <div
                aria-hidden="true"
                className="fixed bottom-0 left-0 right-0 w-full pointer-events-none z-0 select-none overflow-hidden"
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

            {/* Layer 2: Foreground coastal waves (fixed at bottom, z-20) */}
            {/* Content at z-10 emerges from behind these waves as the user scrolls */}
            <div
                aria-hidden="true"
                className="fixed bottom-0 left-0 right-0 w-full pointer-events-none z-20 select-none overflow-hidden"
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
        </>
    );
}
