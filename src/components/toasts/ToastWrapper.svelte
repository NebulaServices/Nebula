<script lang="ts">
import { Toaster } from "svelte-french-toast";
</script>

<div class="hidden" id="toastwrapper">
    <Toaster />
    <slot />
</div>
