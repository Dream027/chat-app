export function generateChatId(user1: string, user2: string) {
    if (user1 === user2) {
        throw new Error("user1 and user2 cannot be same");
    }
    if (user1 === "" || user2 === "") {
        throw new Error("user1 and user2 cannot be empty");
    }
    return user1 > user2 ? user1 + user2 : user2 + user1;
}
