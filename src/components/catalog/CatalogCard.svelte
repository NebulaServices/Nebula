<script>
  let assetPromise = get_assets();
  async function get_assets() {
    const response = await fetch("/api/catalog-assets");
    const data = await response.json();
    return data.assets;
  }
</script>

<div class="text-3xl font-bold underline text-text-color">
  {#await assetPromise}
    Loading assets...
  {:then assets}
    <div class="flex flex-row gap-6">
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
              <div class="font-semibold mb-2">
                {asset.title}
              </div>
              <div class="mb-4">{asset.description}</div>
              <div>
                <strong>Tags:</strong>
                {asset.tags.join(", ")}
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
  {:catch someError}
    System error: {someError.message}.
  {/await}
</div>
