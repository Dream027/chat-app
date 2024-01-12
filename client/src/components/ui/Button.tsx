import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
    "text-white font-semibold rounded focus:outline-none transition duration-300",
    {
        variants: {
            variant: {
                default: "bg-sky-400 hover:bg-sky-300 focus:bg-sky-300",
                outlined:
                    "border border-sky-400 bg-transparent text-sky-400 hover:bg-sky-400 hover:text-white focus:bg-sky-300 focus:text-white",
                ghost: "text-sky-400 hover:bg-sky-400 hover:text-sky-300 focus:text-sky-300",
                icon: "",
            },
            size: {
                default: "py-2 px-4",
            },
            width: {
                full: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        children: React.ReactNode;
        isLoading?: boolean;
    };

export default function Button({
    children,
    isLoading,
    width,
    variant,
    size,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={isLoading ?? false}
            className={cn(buttonVariants({ variant, size, width }), className)}
            {...props}
        >
            {children}
        </button>
    );
}
