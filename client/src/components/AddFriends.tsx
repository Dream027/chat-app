"use client";

import { useFetch } from "@/hooks/useFetch";
import { useSession } from "@/context/SessionProvider";
import styles from "./styles/add-friends.module.css";
import { CheckCircle, Loader, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { handleFetch } from "@/utils/fetch";

export default function AddFriends() {
    const { data, loading } = useFetch<{ invitations: Invitation[] }>(
        "/users/invitations",
    );
    const invitations = data?.invitations;
    const session = useSession();
    const [receivedInvitations, setReceivedInvitations] = useState<
        Invitation[] | undefined | null
    >(null);
    const [sentInvitations, setSentInvitations] = useState<
        Invitation[] | null | undefined
    >(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setReceivedInvitations(
            invitations?.filter(
                (invitation) => invitation.receiver._id === session?._id,
            ),
        );
        setSentInvitations(
            invitations?.filter(
                (invitation) => invitation.sender._id === session?._id,
            ),
        );
    }, [data, invitations, session]);

    async function deleteInvitation(id: string) {}

    async function acceptInvitation(id: string) {}

    async function rejectInvitation(id: string) {}

    async function inviteFriend() {
        const email = inputRef?.current?.value;
        if (!email) {
            toast.error("Email field is required.");
            return;
        }
        const invitation = (await handleFetch("/friends/invite", "POST", {
            email,
        })) as Invitation[] | null;

        if (!invitation) {
            return;
        }

        setSentInvitations((prevState) => {
            if (!prevState) {
                return [invitation[0]];
            }
            return [...prevState, invitation[0]];
        });
    }

    return (
        <div className={styles.main}>
            <div>
                <div>
                    <label htmlFor="name">Email Address</label>
                    <input
                        ref={inputRef}
                        type="email"
                        id="name"
                        placeholder="Friend's Email"
                    />
                </div>
                <button onClick={inviteFriend}>Add Friend</button>
            </div>

            <div className={styles.container}>
                <div>
                    <h3>Sent Requests</h3>
                    <div className={styles.content}>
                        {!sentInvitations || sentInvitations.length === 0 ? (
                            <div className={styles.placeholder}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div>No sent invitations</div>
                                )}
                            </div>
                        ) : (
                            sentInvitations.map((invitation) => (
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
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3>Received Requests</h3>
                    <div className={styles.content}>
                        {!receivedInvitations ||
                        receivedInvitations.length === 0 ? (
                            <div className={styles.placeholder}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div>No received invitations</div>
                                )}
                            </div>
                        ) : (
                            receivedInvitations.map((invitation) => (
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
