import Link from "next/link";
import "./styles/Navbar.css";

const navbarOptions = [
    { name: "Home", path: "/" },
    { name: "View Invitations", path: "/users/invitations" },
    { name: "Send Invitation", path: "/friends/invite" },
    { name: "View Groups", path: "/groups" },
    { name: "Create Group", path: "/groups/create" },
    { name: "Join Group", path: "/groups/join" },
];

export default function Navbar() {
    return (
        <header>
            <div>logo</div>
            <nav>
                <menu>
                    {navbarOptions.map((option) => (
                        <li key={option.name}>
                            <Link href={option.path}>{option.name}</Link>
                        </li>
                    ))}
                </menu>
            </nav>
        </header>
    );
}
