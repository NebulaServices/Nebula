<script>
  export let page;
  let assetPromise = get_assets();
  async function get_assets() {
    const response = await fetch("/api/catalog-assets?page=" + page);
    const data = await response.json();
    return data.assets;
  }
</script>

<div class="text-3xl roboto font-bold text-text-color p-10">
  {#await assetPromise}
    Loading assets...
  {:then assets}
    {#if Object.keys(assets).length > 1}
      <div class="flex flex-row gap-6 flex-wrap justify-center">
        {#each Object.entries(assets) as [key, asset]}
          <a href={"/assets/" + key}>
            <div
              class="bg-navbar-color w-64 rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                src={"/images/" + asset.image}
                alt={asset.title}
                class="w-full h-40 object-cover"
              />
              <div class="p-6 text-sm">
                <div class="font-semibold text-2xl mb-2">
                  {asset.title}
                </div>
                <div class="mb-4">{asset.description}</div>
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each asset.tags as tag}
                    <div
                      class="bg-navbar-text-color text-navbar-color font-bold px-3 py-1 rounded-md text-center"
                    >
                      {tag}
                    </div>
                  {/each}
                </div>
                <div>
                  <strong>Version:</strong>
                  {asset.version}
                </div>
                <div><strong>Type:</strong> {asset.type}</div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-2xl text-center text-text-color mt-6 w-96">
        No assets available at the moment. The server host's database is empty.
        Please contact the maintainer of this site if you think this is an
        error.
      </div>
    {/if}
  {:catch someError}
    <div class="text-lg text-center text-red-500 mt-6">
      System error: {someError.message}.
    </div>
  {/await}
</div>
