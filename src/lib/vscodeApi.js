class VsCodeApi {
    constructor() {
        if (typeof acquireVsCodeApi == 'function') {
            this.acquired = true
            this.api = acquireVsCodeApi()
        } else {
            this.acquired = false
        }
    }
    postMessage(data) {
        this.acquired
            ? this.api.postMessage(data)
            : window.postMessage(data)
    }
}

export default new VsCodeApi()
export { VsCodeApi }
