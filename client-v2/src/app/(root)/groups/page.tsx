import { fetchServer } from "@/utils/fetchServer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "All Groups Joined",
};

export default async function UserGroupsPage() {
    const groups = (await fetchServer("/groups/all", "GET")) as Group[];

    return (
        <div className="margined-layout">
            <h1>All Groups</h1>
            <div>
                {!groups || groups.length === 0 ? (
                    <p>Join a group</p>
                ) : (
                    groups.map((group) => (
                        <Link
                            href={`/groups/${group._id}`}
                            key={group._id}
                            className="group_card"
                        >
                            <Image
                                src={group.image}
                                alt=""
                                width={110}
                                height={110}
                            />
                            <div>
                                <h2>{group.name}</h2>
                                <p>{group.description}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
