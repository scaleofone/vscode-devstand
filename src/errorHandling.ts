export function normaliseErr(err: any): Error | object {
    if (err instanceof Error) return err
    if (typeof err == 'object' && err !== null) {
        try {
            JSON.stringify(err) // checking here whether err can be stringified
            return err
        } catch (e) {
            return new Error('Unknown thrown object: { '+Object.getOwnPropertyNames(err).join(', ')+' }')
        }
    }
    try {
        return new Error(err.toString())
    } catch (e) {
        return new Error()
    }
}
