import { fetchClient } from "@/utils/fetchClient";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import styles from "@/styles/AllGroup.module.css";
import { useRouter } from "next/router";

export default function GroupsJoinedPage({ groups }: { groups: Group[] }) {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <h1>Your Groups</h1>
            <div>
                {groups.map((group) => (
                    <div key={group._id} className={styles.group}>
                        <div onClick={() => router.push(`/group/${group._id}`)}>
                            <Image
                                src={group.image}
                                alt=""
                                width={80}
                                height={80}
                            />
                        </div>
                        <div
                            onClick={() =>
                                router.push(`/group/${group._id}/chat`)
                            }
                        >
                            <div>
                                <h3>{group.name}</h3>
                                <p>{group.description}</p>
                            </div>
                            <div>
                                <ChevronRight />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const res = await fetchClient("/groups/all", "GET", null, {
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
            groups: res.data,
        },
    };
}
