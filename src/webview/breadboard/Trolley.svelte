<script>
    import { grabbingVariableColorHex, grabbingRecord as record } from './stores/visual'
</script>

{#if $record}
    <div class="reference-trolley shadow-square font-mono height-mono flex items-center"
        style={'color:'+$grabbingVariableColorHex}
        >
        <span style="font-weight:bold;">{$record.componentIdentifier}.</span>
        <span>{($record.scope ? ($record.scope + '.') : '')}</span>
        <span>{$record.identifier}</span>
    </div>
{/if}
