"use client";

import { useFetch } from "@/hooks/useFetch";
import { useSession } from "@/context/SessionProvider";
import styles from "./styles/add-friends.module.css";
import { CheckCircle, Trash2 } from "lucide-react";

export default function AddFriends() {
    const { data } = useFetch<{ invitations: Invitation[] }>(
        "/users/invitations",
    );
    const invitations = data?.invitations;
    const session = useSession();

    async function deleteInvitation(id: string) {}

    async function acceptInvitation(id: string) {}

    async function rejectInvitation(id: string) {}

    return (
        <div className={styles.main}>
            <div>
                <div>
                    <label htmlFor="name">Username or Email</label>
                    <input type="text" id="name" placeholder="Name or Email" />
                </div>
                <button>Add Friend</button>
            </div>

            <div className={styles.container}>
                <div>
                    <h3>Sent Requests</h3>
                    <div className={styles.content}>
                        {invitations
                            ?.filter(
                                (invitation) =>
                                    invitation.sender._id === session?._id,
                            )
                            .map((invitation) => (
                                <div
                                    key={invitation._id}
                                    className={`card ${styles.card}`}
                                >
                                    <div></div>
                                    <div>
                                        <h3>{invitation.receiver.name}</h3>
                                        <p>{invitation.receiver.email}</p>
                                    </div>
                                    <div>
                                        <div
                                            onClick={() =>
                                                deleteInvitation(invitation._id)
                                            }
                                            className={styles.deleteIcon}
                                        >
                                            <Trash2 />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div>
                    <h3>Received Requests</h3>
                    <div className={styles.content}>
                        {invitations
                            ?.filter(
                                (invitation) =>
                                    invitation.sender._id !== session?._id,
                            )
                            .map((invitation) => (
                                <div
                                    key={invitation._id}
                                    className={`card ${styles.card}`}
                                >
                                    <div></div>
                                    <div>
                                        <h3>{invitation.sender.name}</h3>
                                        <p>{invitation.sender.email}</p>
                                    </div>
                                    <div>
                                        <div
                                            onClick={() =>
                                                acceptInvitation(invitation._id)
                                            }
                                            className={styles.checkIcon}
                                        >
                                            <CheckCircle />
                                        </div>
                                        <div
                                            onClick={() =>
                                                rejectInvitation(invitation._id)
                                            }
                                            className={styles.deleteIcon}
                                        >
                                            <Trash2 />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
