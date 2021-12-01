<script>
    import { listing, listingPromise, listingAsString } from './stores/listing'
</script>

<div>

    <div>

        <button class="w-auto" on:click="{
            () => listing.requestDirectory('/')
        }">Request listing /</button>

        <button class="w-auto" on:click="{
            () => listing.requestDirectory('/vendor')
        }">Request listing /vendor</button>

        <button class="w-auto" on:click="{
            () => listing.requestFindFiles({ pattern: '**/composer.json', exclude: '**​/node_modules/**' })
        }">Find all composer.json files</button>

        <button class="w-auto" on:click="{
            () => listing.requestFindFiles({ pattern: '**/.gitignore', exclude: '{**​/node_modules/**,vendor/**}' })
        }">Find all .gitignore files</button>

        <button class="w-auto" on:click="{
            () => listing.truncate(2)
        }">Truncate 2 items from listing</button>

        <button class="w-auto" on:click="{
            () => listing.reset()
        }">Reset listing</button>

    </div>
    <br>

    Listing

    {#if $listingPromise !== null }
        {#await $listingPromise} ...fetching {:then} fetched {:catch error} <b>{error.message}</b> {/await}
    {/if}

    <pre
        style="min-height:10em"
        class="listing-pre"
    >{ $listingAsString }</pre>

</div>
