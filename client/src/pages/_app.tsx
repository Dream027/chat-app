import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page: any) => page);

    return (
        <main className={inter.className}>
            <Navbar />
            {getLayout(<Component {...pageProps} />)}
        </main>
    );
}
