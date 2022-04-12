/**
 * @param {string} command
 * @param {object} options
 */
export default function execSync(command, options) {
    // TODO detect web
    const useShim = false
    const cp = (typeof child_process != 'undefined') ? child_process : (! useShim ? require('child_process') : {
        execSync: () => { console.warn('TBD child_process.execSync() shim for web') }
    })
    return cp.execSync(command, options)
}
