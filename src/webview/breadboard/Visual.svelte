<script>
    import Zoomer from './Zoomer.svelte'
    let zoom = 1
</script>

<h1>Hello visual</h1>
<pre>{zoom}</pre>

<div style="position: fixed; bottom: 0; right: 0; padding: 1rem;">
    <Zoomer
        zoom={zoom}
        on:zoom={(event) => zoom = event.detail}
    />
</div>
