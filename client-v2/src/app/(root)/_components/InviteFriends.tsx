"use client";

import { handleFetch } from "@/utils/handleFetch";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export default function InviteFriends() {
    const [friend, setFriend] = useState<User | null>(null);
    const [loading, setLoading] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const searchFriend = useCallback(async () => {
        setLoading(1);
        if (!inputRef.current) return;
        const res = await handleFetch(
            `/users/friends/search?email=${inputRef.current.value}`,
            "GET"
        );
        setLoading(2);
        setFriend(res);
    }, []);

    const inviteFriend = useCallback(async (id: string) => {
        await handleFetch(`/users/${id}/invite`, "POST");
    }, []);

    return (
        <div className="invitations_main">
            <div>
                <h1>Invite Friend</h1>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <div>
                        <input type="email" id="email" ref={inputRef} />
                        <button onClick={searchFriend}>Search</button>
                    </div>
                </div>
            </div>
            <div className="invitations_result">
                {loading === 0 ? null : loading === 1 ? (
                    <Loader className="loader" />
                ) : (
                    <>
                        <h3>Results</h3>
                        {friend ? (
                            <div>
                                <div>
                                    <Image
                                        src={friend?.image}
                                        alt=""
                                        width={60}
                                        height={60}
                                    />
                                    <div>
                                        <h3>{friend.name}</h3>
                                        <p>{friend.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => inviteFriend(friend._id)}
                                    >
                                        Invite
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>Friend not found</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
