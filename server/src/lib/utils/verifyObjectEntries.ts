export function verifyObjectEntries(object: any, keys: string[]) {
    const unknownKeys = Object.keys(object).filter(
        (key) => !keys.includes(key),
    );
    return unknownKeys.length === 0;
}
