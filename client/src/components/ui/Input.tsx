import { cn } from "@/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

export default function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={cn(
                "w-full rounded border border-gray-400 bg-transparent px-4 py-2 text-gray-600 focus:border-blue-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            )}
            {...props}
        />
    );
}
