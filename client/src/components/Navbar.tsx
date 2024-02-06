import { navbarOptions } from "@/constants";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav>
            <div></div>
            <ul>
                {navbarOptions.map((option) => (
                    <li key={option.name}>
                        <Link
                            href={option.path}
                            className={
                                router.pathname === option.path
                                    ? "active-link"
                                    : ""
                            }
                        >
                            {option.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
