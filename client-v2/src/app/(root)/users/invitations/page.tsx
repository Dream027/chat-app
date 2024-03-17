import { fetchServer } from "@/utils/fetchServer";
import UserInvatations from "../../_components/UserInvatations";

export const metadata = {
    title: "View All Invitations",
};

export default async function UsersInvitationsPage() {
    const invitations = await fetchServer("/users/invitations", "GET");
    return <UserInvatations invitations={invitations} />;
}
