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
    <ul>
      {#each Object.entries(assets) as [key, asset]}
        <div class="bg-bg-primary">
          <h2>{asset.title}</h2>
          <p>{asset.description}</p>
          <img src={"/images/" + asset.image} alt={asset.title} />
          <p><strong>Tags:</strong> {asset.tags.join(", ")}</p>
          <p><strong>Version:</strong> {asset.version}</p>
          <p><strong>Type:</strong> {asset.type}</p>
        </div>
      {/each}
    </ul>
  {:catch someError}
    System error: {someError.message}.
  {/await}
</div>
