import { fetchServer } from "@/utils/fetchServer";
import Image from "next/image";
import GroupProfile from "../../_components/GroupProfile";
import { notFound } from "next/navigation";

export default async function GroupPage({
    params: { groupId },
}: {
    params: { groupId: string };
}) {
    const group = (await fetchServer(`/groups?id=${groupId}`, "GET")) as Group;
    if (!group) {
        notFound();
    }
    return (
        <div className="margined-layout profile_main">
            <div>
                <Image
                    src={group.image}
                    alt=""
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%" }}
                />
                <div style={{ marginTop: "1rem" }}>
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                </div>
            </div>
            <GroupProfile group={group} />
        </div>
    );
}
