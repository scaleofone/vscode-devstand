<script>
    import { components } from './stores/breadboard'
    import { squareDimensions, brickClamps, crawl, arrows, brickCoordinates } from './stores/arrows'
    import { pointer } from './stores/visual'
</script>

<div style="position: fixed; top: 0; right: 0; padding: 1rem;">
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">components</summary>
        <pre style="background-color: white;">{JSON.stringify($components, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">pointer</summary>
        <pre style="background-color: white;">{JSON.stringify($pointer, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">brickCoordinates</summary>
        <pre style="background-color: white;">{JSON.stringify($brickCoordinates, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">squareDimensions <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($squareDimensions, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">brickClamps <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($brickClamps, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">arrows <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($arrows, null, 2)}</pre>
    </details>
</div>
