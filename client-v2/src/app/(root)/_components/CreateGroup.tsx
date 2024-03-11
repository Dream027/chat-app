"use client";

import { handleFetch } from "@/utils/handleFetch";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export default function GroupCreate() {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const descRef = useRef<HTMLTextAreaElement | null>(null);
    const router = useRouter();

    const createGroup = useCallback(async () => {
        if (!nameRef.current || !descRef.current) return;
        const res = await handleFetch("/groups/create", "POST", {
            name: nameRef.current?.value,
            description: descRef.current?.value,
        });
        router.push(`/groups/${res._id}/edit`);
    }, []);
    return (
        <div className="margined-layout group_main">
            <h1 style={{ marginBottom: "2rem" }}>Create Group</h1>
            <div>
                <div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" ref={nameRef} />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" ref={descRef} />
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "2rem" }} className="align-center">
                <button className="btn-secondary" onClick={() => router.back()}>
                    Cancel
                </button>
                <button onClick={createGroup}>Create</button>
            </div>
        </div>
    );
}
