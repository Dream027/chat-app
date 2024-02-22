export default function AlertDialog({
    children,
    active,
    ...props
}: {
    children: React.ReactNode;
    active: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`alert-backdrop ${active ? "alert-active" : ""}`}>
            <div {...props} className={`alert-box`}>
                {children}
            </div>
        </div>
    );
}
