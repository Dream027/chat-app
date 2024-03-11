"use client";

import { handleFetch } from "@/utils/handleFetch";
import { Loader } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";

export default function JoinGroup() {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(0);
    const [group, setGroup] = useState<Group | null>(null);

    const searchGroup = useCallback(async () => {
        setLoading(1);
        if (!nameRef.current) return;
        const res = await handleFetch(
            `/groups/search?name=${nameRef.current.value}`,
            "GET"
        );
        console.log(res);
        setLoading(2);
        setGroup(res);
    }, []);

    const joinGroup = useCallback(async (id: string) => {
        await handleFetch(`/groups/${id}/join`, "POST");
    }, []);

    return (
        <div className="invitations_main">
            <div>
                <h1>Join Group</h1>
                <div>
                    <label htmlFor="name">Group Name</label>
                    <div>
                        <input type="text" id="name" ref={nameRef} />
                        <button onClick={searchGroup}>Search</button>
                    </div>
                </div>
            </div>
            <div className="invitations_result">
                {loading === 0 ? null : loading === 1 ? (
                    <Loader className="loader" />
                ) : (
                    <>
                        <h3>Results</h3>
                        {group ? (
                            <div>
                                <div>
                                    <Image
                                        src={group.image}
                                        alt=""
                                        width={60}
                                        height={60}
                                    />
                                    <div>
                                        <h3>{group.name}</h3>
                                        <p>{group.description}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => joinGroup(group._id)}
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>Group not found</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
