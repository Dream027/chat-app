const STATIC_SERVER_PORT = 8000;

export function generateFileLink(name: string) {
    return `http://localhost:${STATIC_SERVER_PORT}/${name}`;
}
