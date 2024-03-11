"use client";

import { fetchClient } from "@/utils/fetchClient";
import { handleFetch } from "@/utils/handleFetch";
import { Loader, PenBox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type GroupMembers = {
    members: User[];
    admins: User[];
    creator: User;
};

export default function GroupProfile({ group }: { group: Group }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<GroupMembers | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetchClient(
                `/groups/${group._id}/members`,
                "GET"
            );
            if (res?.success) {
                setMembers(res.data);
            }
            setLoading(false);
        })();
    }, [group]);

    const joinGroup = useCallback(async () => {
        const res = await handleFetch(`/groups/${group._id}/join`, "POST");
        if (res) {
            router.push(`/groups/${group._id}/chat`);
        }
    }, [group, router]);

    const leavegroup = useCallback(async () => {
        const res = await handleFetch(`/groups/${group._id}/leave`, "POST");
        if (res) {
            router.refresh();
        }
    }, [group, router]);

    return (
        <div>
            <div className="align-center">
                <button
                    className="btn-secondary"
                    onClick={() => router.push(`/groups/${group._id}/edit`)}
                >
                    <PenBox />
                    Edit Group
                </button>
                {group.isMember ? (
                    <button onClick={leavegroup}>Leave Group</button>
                ) : (
                    <button onClick={joinGroup}>Join Group</button>
                )}
            </div>

            <div className="group_members">
                {loading ? (
                    <Loader className="loader" />
                ) : members ? (
                    <>
                        <h2>Members</h2>
                        <div className="group_members_container">
                            <div>
                                <h3>Group Creator</h3>
                                <div className="group_member">
                                    <div>
                                        <Image
                                            src={members.creator.image}
                                            alt=""
                                            width={50}
                                            height={50}
                                            style={{ borderRadius: "50%" }}
                                        />
                                        <div>
                                            <h4>{members.creator.name}</h4>
                                            <p>{members.creator.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {!members.admins.length ? null : (
                                    <>
                                        <h3>Admins</h3>
                                        <div className="group_member">
                                            {members.admins.map((admin) => (
                                                <div key={admin._id}>
                                                    <Image
                                                        src={admin.image}
                                                        alt=""
                                                        width={50}
                                                        height={50}
                                                        style={{
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                    <div>
                                                        <h4>{admin.name}</h4>
                                                        <p>{admin.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {!members.members.length ? null : (
                                    <>
                                        <h3>Members</h3>
                                        <div className="group_member">
                                            {members.members.map((member) => (
                                                <div key={member._id}>
                                                    <Image
                                                        src={member.image}
                                                        alt=""
                                                        width={50}
                                                        height={50}
                                                        style={{
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                    <div>
                                                        <h4>{member.name}</h4>
                                                        <p>{member.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <h2 style={{ color: "hsl(0, 80%, 50%)" }}>
                        Something went wrong
                    </h2>
                )}
            </div>
        </div>
    );
}
