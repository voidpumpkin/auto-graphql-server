export async function syncAsyncForEatch<T>(
    arr: T[],
    cb: (value: T) => Promise<void>
): Promise<void> {
    return await arr.reduce(async (prevPromise, value) => {
        await prevPromise;
        await cb(value);
    }, Promise.resolve());
}
