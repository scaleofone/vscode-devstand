<script>
    import { components, records, schemaDictionary } from './stores/breadboard'
</script>

<br>
<details class="inline-block">
    <summary class="cursor-pointer hover:fg-link select-none">records</summary>
    <pre>{JSON.stringify($records.map(r => ({...r, vscodeRange: undefined})), null, 2)}</pre>
    <br><br>
</details>

<br>
<details class="inline-block">
    <summary class="cursor-pointer hover:fg-link select-none">components</summary>
    <pre>{JSON.stringify($components, null, 2)}</pre>
    <br><br>
</details>

<br>
<details class="inline-block">
    <summary class="cursor-pointer hover:fg-link select-none">schemaDictionary</summary>
    <pre>{JSON.stringify($schemaDictionary, null, 2)}</pre>
    <br><br>
</details>
