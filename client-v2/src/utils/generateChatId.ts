export function generateChatId(id1: string, id2: string) {
    if (id2 > id1) {
        return `${id1}-${id2}`;
    } else {
        return `${id2}-${id1}`;
    }
}
