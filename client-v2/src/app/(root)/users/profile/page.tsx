import "@/styles/Profile.css";
import { getServerSession } from "@/utils/getServerSession";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserProfilePage() {
    const session = await getServerSession();
    if (!session) notFound();
    return (
        <div className="margined-layout">
            <div>
                <Image src={session.image} alt="" width={120} height={120} />
                <div>
                    <h2>{session.name}</h2>
                    <p>{session.email}</p>
                </div>
            </div>
        </div>
    );
}
