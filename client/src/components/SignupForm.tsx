"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { handleFetch } from "@/utils/fetchServer";
import { register } from "@/utils/auth";

export default function SignupForm() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        await register({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-8 grid gap-8">
                <div>
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="name" name="name" required />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" required />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                        />
                    </div>
                    <Button width="full" className="mt-4">
                        Create Account
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <hr className="h-px w-full border-0 bg-gray-200" />
                    <span className="text-gray-500">or</span>
                    <hr className="h-px w-full border-0 bg-gray-200" />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <h3>Already have an account?</h3>
                    <Link
                        href="/login"
                        className="text-sky-500 hover:text-sky-600"
                    >
                        Log in to account
                    </Link>
                </div>
            </div>
        </form>
    );
}
