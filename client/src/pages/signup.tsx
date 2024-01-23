import Head from "next/head";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
    return (
        <>
            <Head>
                <title>Create your account</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SignupForm />
        </>
    );
}
