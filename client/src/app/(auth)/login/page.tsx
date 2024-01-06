import Card from "@/components/ui/Card";
import LoginForm from "@/components/LoginForm";
import Container from "@/components/ui/Container";

export default function LoginPage() {
    return (
        <div className="grid min-h-screen w-full place-items-center">
            <Container>
                <Card title="Login to your account" logo="/logo.png">
                    <LoginForm />
                </Card>
            </Container>
        </div>
    );
}
