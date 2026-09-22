export default function GlassFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full max-w-6xl mx-auto my-8 px-6 sm:px-8">
            {children}
        </div>
    );
}
