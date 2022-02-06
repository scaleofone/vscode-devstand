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

export function convertErrToPayload (err: any): string | object {
    let result = normaliseErr(err)
    if (result instanceof Error) {
        return result.toString()
    } else {
        return result
    }
}

export function convertPayloadToErr (err: string | object): Error | object {
    try {
        if (typeof err == 'object') {
            return err
        } else {
            let error = new Error(err.toString())
            if (err.toString().match(/^[a-z]{1,}$/im)) {
                error.name = err.toString()
                error.message = ''
            } else {
                let matches = err.toString().match(/^(?<name>[a-z]{1,}):\s(?<message>.*)/im)
                if (matches && matches.groups && matches.groups.name && matches.groups.message) {
                    error.name = matches.groups.name
                    error.message = matches.groups.message
                }
            }
            return error
        }
    } catch (e) {
        return new Error()
    }
}
