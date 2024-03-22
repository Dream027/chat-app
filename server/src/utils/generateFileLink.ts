export function generateFileLink(name: string) {
    return `${process.env.STATIC_URL}/${name}`;
}
