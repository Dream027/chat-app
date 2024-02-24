type Group = {
    _id: string;
    name: string;
    description: string;
    image: string;
    isMember: boolean;
    members: number;
    role: "member" | "admin" | "creator" | "none";
};
