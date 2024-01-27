import SidebarLayout from "@/layouts/SidebarLayout";
import Head from "next/head";
import AddFriends from "@/components/AddFriends";

export default function AddFriendsPage() {
    return (
        <>
            <Head>
                <title>Add friends</title>
            </Head>
            <AddFriends />
        </>
    );
}

AddFriendsPage.getLayout = function getLayout(page: React.ReactElement) {
    return <SidebarLayout>{page}</SidebarLayout>;
};
