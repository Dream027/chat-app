import styles from "@/styles/ViewInvitations.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader } from "lucide-react";
import { fetchClient } from "@/utils/fetchClient";
import { useSession } from "@/contexts/SessionProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type Invitation = {
    _id: string;
    sender: User;
    receiver: User;
};

export default function ViewInvitationsPage() {
    const [activeCarousel, setActiveCarousel] = useState(0);
    const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<
        Invitation[]
    >([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const router = useRouter();

    async function acceptInvitation(id: string) {
        try {
            const res = await fetchClient(
                `/users/${id}/invitations/accept`,
                "POST"
            );
            if (res.success) {
                toast.success(res.message);
                setReceivedInvitations((prev) =>
                    prev.filter((inv) => inv._id !== res.data)
                );
                router.reload();
            } else {
                toast.error(res.message);
            }
            console.log(res);
        } catch (err: any) {
            console.error(err.message);
            toast.error("Something went wrong");
        }
    }

    async function rejectInvitation(id: string) {
        try {
            const res = await fetchClient(
                `/users/${id}/invitations/reject`,
                "DELETE"
            );
            if (res.success) {
                toast.success(res.message);
                setReceivedInvitations((prev) =>
                    prev.filter((inv) => inv._id !== res.data)
                );
            } else {
                toast.error(res.message);
            }
            console.log(res);
        } catch (err: any) {
            console.error(err.message);
            toast.error("Something went wrong");
        }
    }

    async function deleteInvitation(id: string) {
        try {
            const res = await fetchClient(`/users/${id}/invitations`, "DELETE");
            if (res.success) {
                toast.success(res.message);
                setSentInvitations((prev) =>
                    prev.filter((inv) => inv._id !== res.data)
                );
            } else {
                toast.error(res.message);
            }
            console.log(res);
        } catch (err: any) {
            console.error(err.message);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        (async () => {
            if (!session) return;
            try {
                const res = await fetchClient("/users/invitations", "GET");
                setSentInvitations(
                    res.data.filter(
                        (invitation: Invitation) =>
                            invitation.sender._id === session._id
                    )
                );
                setReceivedInvitations(
                    res.data.filter(
                        (invitation: Invitation) =>
                            invitation.receiver._id === session._id
                    )
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {loading ? (
                    <Loader className={`loader ${styles.loader}`} />
                ) : (
                    <>
                        <div
                            className={`${styles.carousel} ${activeCarousel === 1 ? styles.active_carousel : ""}`}
                        >
                            <div
                                onClick={() => {
                                    activeCarousel === 1
                                        ? setActiveCarousel(0)
                                        : setActiveCarousel(1);
                                }}
                            >
                                <h3>Sent Invitations</h3>
                                {activeCarousel === 1 ? (
                                    <ArrowUp className={styles.icon} />
                                ) : (
                                    <ArrowDown className={styles.icon} />
                                )}
                            </div>
                            <div className={styles.carousel_content}>
                                {sentInvitations.length === 0 ? (
                                    <div className={styles.placeholder}>
                                        <h3>No sent invitations</h3>
                                    </div>
                                ) : (
                                    <>
                                        {sentInvitations.map((invitation) => (
                                            <div
                                                className={styles.result}
                                                key={invitation._id}
                                            >
                                                <Image
                                                    src={
                                                        invitation.receiver
                                                            .image
                                                    }
                                                    alt={""}
                                                    width={80}
                                                    height={80}
                                                />
                                                <div>
                                                    <h3>
                                                        {
                                                            invitation.receiver
                                                                .name
                                                        }
                                                    </h3>
                                                    <p>
                                                        {
                                                            invitation.receiver
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() =>
                                                            deleteInvitation(
                                                                invitation
                                                                    .receiver
                                                                    ._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                        <div
                            className={`${styles.carousel} ${activeCarousel === 2 ? styles.active_carousel : ""}`}
                        >
                            <div
                                onClick={() => {
                                    activeCarousel === 2
                                        ? setActiveCarousel(0)
                                        : setActiveCarousel(2);
                                }}
                            >
                                <h3>Received Invitations</h3>
                                {activeCarousel === 2 ? (
                                    <ArrowUp className={styles.icon} />
                                ) : (
                                    <ArrowDown className={styles.icon} />
                                )}
                            </div>
                            <div className={styles.carousel_content}>
                                {receivedInvitations.length === 0 ? (
                                    <div className={styles.placeholder}>
                                        <h3>No received Invitations</h3>
                                    </div>
                                ) : (
                                    <>
                                        {receivedInvitations.map(
                                            (invitation) => (
                                                <div
                                                    className={styles.result}
                                                    key={invitation._id}
                                                >
                                                    <Image
                                                        src={
                                                            invitation.sender
                                                                .image
                                                        }
                                                        alt={""}
                                                        width={80}
                                                        height={80}
                                                    />
                                                    <div>
                                                        <h3>
                                                            {
                                                                invitation
                                                                    .sender.name
                                                            }
                                                        </h3>
                                                        <p>
                                                            {
                                                                invitation
                                                                    .sender
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() =>
                                                                acceptInvitation(
                                                                    invitation
                                                                        .sender
                                                                        ._id
                                                                )
                                                            }
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                rejectInvitation(
                                                                    invitation
                                                                        .sender
                                                                        ._id
                                                                )
                                                            }
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
