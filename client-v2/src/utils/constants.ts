function getUrl() {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!SERVER_URL) throw new Error("Server URL is undefined");
    return SERVER_URL;
}

export const SERVER_URL = getUrl();
