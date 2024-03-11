"use client";

import Carousel from "@/components/Carousel";
import { useSession } from "@/contexts/SessionProvider";
import { handleFetch } from "@/utils/handleFetch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type UserInvitationProps = {
    invitations: {
        _id: string;
        sender: User;
        receiver: User;
    }[];
};
export default function UserInvatations({ invitations }: UserInvitationProps) {
    const [showReceived, setShowReceived] = useState(false);
    const [showsent, setShowsent] = useState(false);
    const session = useSession();
    const router = useRouter();

    const deleteRequest = useCallback(async (id: string) => {
        const res = await handleFetch(`/users/${id}/invitations`, "DELETE");
        if (res) {
            router.refresh();
        }
    }, []);
    const rejectInvitation = useCallback(async (id: string) => {
        const res = await handleFetch(
            `/users/${id}/invitations/reject`,
            "DELETE"
        );
        if (res) {
            router.refresh();
        }
    }, []);
    const acceptInvitation = useCallback(async (id: string) => {
        const res = await handleFetch(
            `/users/${id}/invitations/accept`,
            "POST"
        );
        if (res) {
            router.refresh();
        }
    }, []);

    return (
        <div className="invitations_main">
            <div>
                <Carousel
                    open={showReceived}
                    setOpen={setShowReceived}
                    title="Received Requests"
                >
                    {invitations
                        .filter(
                            (invitation) =>
                                invitation.receiver._id === session?._id
                        )
                        .map((invitation) => (
                            <div
                                className="invitations_user"
                                key={invitation._id}
                            >
                                <div>
                                    <Image
                                        src={invitation.sender.image}
                                        alt=""
                                        width={60}
                                        height={60}
                                    />
                                    <div>
                                        <h3>{invitation.sender.name}</h3>
                                        <p>{invitation.sender.email}</p>
                                    </div>
                                </div>
                                <div className="align-center">
                                    <button
                                        className="btn-secondary"
                                        onClick={() =>
                                            rejectInvitation(
                                                invitation.sender._id
                                            )
                                        }
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() =>
                                            acceptInvitation(
                                                invitation.sender._id
                                            )
                                        }
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                </Carousel>
            </div>
            <div>
                <Carousel
                    open={showsent}
                    setOpen={setShowsent}
                    title="Sent Requests"
                >
                    {invitations
                        .filter(
                            (invitation) =>
                                invitation.sender._id === session?._id
                        )
                        .map((invitation) => (
                            <div
                                className="invitations_user"
                                key={invitation._id}
                            >
                                <div>
                                    <Image
                                        src={invitation.receiver.image}
                                        alt=""
                                        width={60}
                                        height={60}
                                    />
                                    <div>
                                        <h3>{invitation.receiver.name}</h3>
                                        <p>{invitation.receiver.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() =>
                                            deleteRequest(
                                                invitation.receiver._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                </Carousel>
            </div>
        </div>
    );
}
