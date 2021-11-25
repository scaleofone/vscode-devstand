class VscodeApiReal {
    constructor(api) {
        this.api = api
    }
    postMessage(payload) {
        this.api.postMessage(payload) 
    }
}

class VscodeApiEmulated {
    postMessage(payload) {
        window.postMessage(payload)
    }
}

let acquiredVsCodeApi = null;
const vscodeApiFactory = () => {
    if (typeof acquireVsCodeApi == 'function') {
        if (acquiredVsCodeApi === null) {
            acquiredVsCodeApi = acquireVsCodeApi()
        }
        return new VscodeApiReal(acquiredVsCodeApi)
    } else {
        return new VscodeApiEmulated()
    }
}

export { vscodeApiFactory }
