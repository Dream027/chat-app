import { useForm } from "@/hooks/useForm";
import styles from "@/styles/AddFriends.module.css";
import { CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { axiosClient } from "@/utils/axios";
import toast from "react-hot-toast";
import { handleFetch } from "@/utils/handleFetch";

export default function AddFriends() {
    const { handleSubmit, loading, data } = useForm();
    const [email, setEmail] = useState("");

    async function searchFriend({ email }: { email: string }) {
        try {
            const { data, status } = await axiosClient.post(
                "/friends/search",
                {
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                },
            );
            console.log(data);
            if (status !== 200) {
                toast.error(data.message ?? "Something went wrong.");
                return null;
            } else {
                toast.success(data.message ?? "Friend found.");
                return data.data;
            }
        } catch {
            toast.error("Something went wrong.");
            return null;
        }
    }

    async function inviteFriend() {
        if (!data.email) {
            throw new Error("Email is required.");
        }
        await handleFetch("/friends/invite", "POST", {
            email: data.email,
        });
    }

    return (
        <div className={`screen-container ${styles.main}`}>
            <form onSubmit={handleSubmit(searchFriend)} className="container">
                <input
                    value={email}
                    type="email"
                    placeholder="Search for friends by email"
                    name="email"
                    required
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className={`container ${styles.content}`}>
                {loading ? (
                    <Loader className="loader" />
                ) : email.trim() === "" ? (
                    <p>Enter an email and search</p>
                ) : !data ? (
                    <p>No friend found</p>
                ) : (
                    <div className={`card container ${styles.friend_card}`}>
                        <div className="image-container">
                            <Image
                                src={data.image}
                                alt="friend profile image"
                                fill
                            />
                        </div>
                        <div>
                            <h3>{data.name}</h3>
                            <p>{data.email}</p>
                        </div>
                        <div onClick={inviteFriend}>
                            <CheckCircle className={"check-icon"} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
