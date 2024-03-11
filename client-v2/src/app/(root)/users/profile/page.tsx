import "@/styles/Profile.css";
import { getServerSession } from "@/utils/getServerSession";
import Image from "next/image";
import { notFound } from "next/navigation";
import UserProfile from "../../_components/UserProfile";

export default async function UserProfilePage() {
    const session = await getServerSession();
    if (!session) notFound();
    return (
        <div className="margined-layout profile_main">
            <div>
                <Image src={session.image} alt="" width={120} height={120} />
                <div style={{ marginTop: "1rem" }}>
                    <h2>{session.name}</h2>
                    <p>{session.email}</p>
                </div>
            </div>
            <UserProfile session={session} />
        </div>
    );
}
