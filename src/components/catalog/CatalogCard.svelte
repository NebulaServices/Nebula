<script lang="ts">
import { Suspense } from "@svelte-drama/suspense";
import { Settings } from "@utils/settings/index";
export let page;
export let lang;
async function getAssets() {
    const response = await fetch("/api/catalog-assets?page=" + page);
    const data = await response.json();
    return data.assets;
}
const assets = getAssets();
</script>

<div class="text-3xl font-roboto font-bold text-text-color p-10">
    <Suspense let:suspend>
        <div slot="loading">
            <p class="text-4xl"> Loading... </p>
        </div>
        {#await suspend(assets) then data}
            {#if Object.keys(data).length > 0}
                <div class="flex flex-row gap-6 flex-wrap justify-center">
                    {#each Object.entries(data) as [key, asset]}
                        <a href={`/${lang}/catalog/package/${key}`}>
                            <div class="bg-navbar-color w-64 rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                                <img src={`/packages/${key}/${asset.image}`} alt={asset.title} class="w-full h-40 object-cover" />
                                <div class="p-6 text-sm">
                                    <p class="font-semibold text-2xl mb-2"> {asset.title} </p>
                                    <p class="mb-4"> {asset.description} </p>
                                    <div class="flex flex-wrap gap-2 mb-4 w-full">
                                        {#each asset.tags as tag}
                                            <p class="bg-navbar-text-color text-navbar-color font-bold px-3 py-1 rounded-md text-center"> {tag} </p>
                                        {/each}
                                    </div>
                                    <div>
                                        <strong>Version:</strong>
                                        {asset.version}
                                    </div>
                                    <div><strong>Type:</strong> {asset.type === "plugin-page" || asset.type === "plugin-sw" ? "plugin" : asset.type}</div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        {/await}
    </Suspense>
</div>
