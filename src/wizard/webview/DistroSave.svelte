<script>

    import {
        openedFromFolderPath, workspaceFolderPath
    } from './stores/distro'

</script>

<div>
    <pre>{JSON.stringify({
        openedFromFolderPath: $openedFromFolderPath,
        workspaceFolderPath: $workspaceFolderPath,
    }, null, 2)}</pre>

</div>
