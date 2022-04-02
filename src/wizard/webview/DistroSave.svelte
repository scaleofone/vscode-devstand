<script>

    import {
        dirname,
        performSave,
    } from './stores/distro'

</script>

<div class="settings-row-padding">
    <div class="flex items-center gap-x-one">
        <div>
            <button class="inline-block" style="padding-right: 1rem; padding-left: 1rem;"
                on:click={() => performSave()}
            >Create Dockerfile</button>
        </div>

        {#if $dirname}
            <div>
                <span>in this directory: <span class="font-family-mono">{$dirname}</span></span>
            </div>
        {/if}
    </div>
</div>
