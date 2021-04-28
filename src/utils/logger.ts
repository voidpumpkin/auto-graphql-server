export function log(emoji: string, text: string): void {
    console.log(
        `${emoji} \x1b[2m${Date()
            .toString()
            .match(/(\d\d):(\d\d):(\d\d)/g)}\x1b[0m ${text}\x1b[0m`
    );
}
