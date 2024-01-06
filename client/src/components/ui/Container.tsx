import { cn } from "@/utils/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
};

export default function Container({
    children,
    className,
    ...props
}: ContainerProps) {
    return (
        <div className={cn("w-4/5 max-w-[600px]", className)} {...props}>
            {children}
        </div>
    );
}
