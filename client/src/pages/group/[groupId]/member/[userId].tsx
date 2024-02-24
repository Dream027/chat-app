import { fetchClient } from "@/utils/fetchClient";
import styles from "@/styles/GroupMember.module.css";
import Image from "next/image";

type GroupMemberPageProps = {
    group: Group;
    user: User;
};

export default function GroupMemberPage({ group, user }: GroupMemberPageProps) {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <Image
                    src={group.image}
                    alt="Group logo"
                    height={60}
                    width={60}
                />
                <h3>{group.name}</h3>
            </div>
            <div className={styles.user}>
                <div>
                    <Image
                        src={user.image}
                        alt="User image"
                        height={130}
                        width={130}
                    />
                    <div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                </div>
                <h4>{group.role}</h4>
                <div>
                    <button className="btn-secondary">Promote</button>
                    <button>Kick</button>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const res = await fetchClient(
        `/groups/${context.query.groupId}/members/${context.query.userId}`,
        "GET",
        null,
        {
            headers: {
                Authorization: `Bearer ${context.req.cookies.token}`,
            },
        }
    );
    console.log(res.data);

    if (!res?.success) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            group: res.data.group,
            user: res.data.user,
        },
    };
}
