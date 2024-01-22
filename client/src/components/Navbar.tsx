import styles from "@/styles/Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const routes = [
    { path: "/dashboard", name: "Home" },
    { path: "/groups", name: "Groups" },
];

export default function Navbar() {
    const router = useRouter();
    const pathName = router.pathname;

    return (
        <nav className={styles.navbar}>
            <div className={styles.nav_item}>
                {routes.map((route) => (
                    <Link
                        key={route.path}
                        href={route.path}
                        className={`${styles.link} ${pathName === route.path ? styles.active : ""}`}
                    >
                        {route.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
