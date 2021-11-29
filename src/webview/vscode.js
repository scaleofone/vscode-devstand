class VsCodeApi {
    constructor() {
        if (typeof acquireVsCodeApi == 'function') {
            this.acquired = true
            this.api = acquireVsCodeApi()
        } else {
            this.acquired = false
        }
    }
    postMessage(payload) {
        this.acquired
            ? this.api.postMessage(payload)
            : window.postMessage(payload)
    }
}

export default new VsCodeApi()
export { VsCodeApi }
