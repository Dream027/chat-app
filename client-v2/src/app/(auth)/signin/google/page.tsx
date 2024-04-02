import GoogleLogin from "@/components/GoogleLogin";

export const metadata = {
    title: "Create your account with google",
};

export default function GoogleLoginPage({
    searchParams,
}: {
    searchParams: { name: string; email: string; image: string };
}) {
    return <GoogleLogin searchParams={searchParams} />;
}
