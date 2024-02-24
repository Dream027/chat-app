import Image from "next/image";
import styles from "@/styles/Group.module.css";
import { ChevronRight, Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";

type GroupPageProps = {
    group: Group;
    members: { creator: User; admins: User[]; members: User[] };
};

export default function GroupPage({ group, members }: GroupPageProps) {
    const router = useRouter();

    function goToGroupUserPage(id: string) {
        return () => router.push(`/group/${group._id}/member/${id}`);
    }

    async function joinGroup() {
        const res = await fetchClient(`/groups/${group._id}/join`, "POST");

        if (res?.success) {
            router.push(`/group/${group._id}/chat`);
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    async function leaveGroup() {
        const res = await fetchClient(`/groups/${group._id}/leave`, "POST");

        if (res?.success) {
            router.push(`/`);
            router.reload();
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    return (
        <div className={styles.main}>
            <div>
                <div className={styles.header}>
                    <Image
                        src={group.image}
                        alt="Group logo"
                        height={130}
                        width={130}
                    />
                    <div>
                        <h3>{group.name}</h3>
                        <p>{group.members} members</p>
                    </div>
                    <div>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                if (group.role === "member") {
                                    toast.error("Only admins can edit group");
                                    return;
                                }
                                router.push(`/group/${group._id}/edit`);
                            }}
                        >
                            <Edit2 />
                            Edit
                        </button>
                        {group.isMember ? (
                            <button onClick={leaveGroup}>Leave</button>
                        ) : (
                            <button onClick={joinGroup}>Join</button>
                        )}
                    </div>
                </div>
                <div className={styles.info}>
                    <h2>What we&apos;re all about</h2>
                    <p>{group.description}</p>
                </div>
                <div className={styles.members_section}>
                    <div>
                        <h2>Creator</h2>
                        <div>
                            <div
                                className={styles.member}
                                onClick={goToGroupUserPage(members.creator._id)}
                            >
                                <div>
                                    <Image
                                        src={members.creator.image}
                                        alt="Group logo"
                                        height={50}
                                        width={50}
                                    />
                                    <h3>{members.creator.name}</h3>
                                </div>
                                <div>
                                    <ChevronRight />
                                </div>
                            </div>
                        </div>
                    </div>
                    <>
                        {members.members.length === 0 ? null : (
                            <div>
                                <h2>Admins</h2>
                                <div>
                                    {members.admins.map((admin) => (
                                        <div
                                            className={styles.member}
                                            key={admin._id}
                                            onClick={goToGroupUserPage(
                                                admin._id
                                            )}
                                        >
                                            <div>
                                                <Image
                                                    src={admin.image}
                                                    alt="Group logo"
                                                    height={50}
                                                    width={50}
                                                />
                                                <h3>{admin.name}</h3>
                                            </div>
                                            <div>
                                                <ChevronRight />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                    <>
                        {members.admins.length === 0 ? null : (
                            <div>
                                <h2>Members</h2>
                                <div>
                                    {members.members.map((member) => (
                                        <div
                                            className={styles.member}
                                            key={member._id}
                                            onClick={goToGroupUserPage(
                                                member._id
                                            )}
                                        >
                                            <div>
                                                <Image
                                                    src={member.image}
                                                    alt="Group logo"
                                                    height={50}
                                                    width={50}
                                                />
                                                <h3>{member.name}</h3>
                                            </div>
                                            <div>
                                                <ChevronRight />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const { groupId } = context.query;
    const res = await fetchClient(`/groups?id=${groupId}`, "GET", null, {
        headers: {
            Authorization: `Bearer ${context.req.cookies.token}`,
        },
    });

    const res2 = await fetchClient(`/groups/${groupId}/members`, "GET", null, {
        headers: {
            Authorization: `Bearer ${context.req.cookies.token}`,
        },
    });

    if (!res?.success) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            group: res.data,
            members: res2.data,
        },
    };
}
