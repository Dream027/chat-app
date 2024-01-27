import Head from "next/head";
import styles from "@/styles/Home.module.css";
import SidebarLayout from "@/layouts/SidebarLayout";

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div>Home</div>
        </>
    );
}

HomePage.getLayout = function getLayout(page: React.ReactElement) {
    return <SidebarLayout>{page}</SidebarLayout>;
};
