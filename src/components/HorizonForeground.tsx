export default function HorizonForeground() {
    // Shared classes for both sky and foreground layers.
    // Both must use IDENTICAL object-fit and object-position so the
    // browser's GPU compositor scales and crops them identically.
    // This eliminates drift between the two layers on every device.
    const sharedImgClasses =
        "fixed inset-0 w-full h-full object-cover object-[70%_bottom] pointer-events-none select-none";

    return (
        <>
            {/* Layer 0: Sky background (fixed, covers viewport, z-0) */}
            <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/real_read_mode.original.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`dark:hidden ${sharedImgClasses}`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/real_write_mode.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`hidden dark:block ${sharedImgClasses}`}
                />
            </div>

            {/* Layer 2: Foreground waves & lighthouse (fixed, covers viewport, z-20) */}
            <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/horizon_foreground_light.png"
                    alt=""
                    fetchPriority="high"
                    decoding="sync"
                    className={`dark:hidden ${sharedImgClasses}`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
