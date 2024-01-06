import { cn } from "@/utils/cn";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
    children: React.ReactNode;
};

export default function Label({ children, className, ...props }: LabelProps) {
    return (
        <label
            className={cn("font-semibold text-gray-500", className)}
            {...props}
        >
            {children}
        </label>
    );
}
