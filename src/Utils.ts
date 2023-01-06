export namespace Utils {
    export function cleanup<T = unknown>(data: T): T {
        return JSON.parse(JSON.stringify(data)) as T;
    }
}
