import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import SidebarChat from "@/components/SidebarChat";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={inter.className}>
            <Navbar />
            <Component {...pageProps} />
        </main>
    );
}
