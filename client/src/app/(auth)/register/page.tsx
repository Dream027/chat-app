import Card from "@/components/ui/Card";
import SignupForm from "@/components/SignupForm";
import Container from "@/components/ui/Container";

export default function LoginPage() {
    return (
        <div className="grid min-h-screen w-full place-items-center">
            <Container>
                <Card title="Create your account" logo="/logo.png">
                    <SignupForm />
                </Card>
            </Container>
        </div>
    );
}
