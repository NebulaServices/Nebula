<script lang="ts">
import { type ToastPosition, type Props, type TType } from "@utils/index";
import toast from "svelte-french-toast";
export let toastProp: Props;
function handleToast(toastProp: Props) {
    switch (toastProp.toastType) {
        case "success":
            toast.success(toastProp.text, {
                style: "background: var(--navbar-color); color: var(--input-text-color);",
                icon: toastProp.emoji,
                position: toastProp.position ?? "bottom-right",
                duration: toastProp.duration
            });
            break;
        case "error":
            toast.error(toastProp.text, {
                style: "background: var(--navbar-color); color: var(--input-text-color);",
                icon: toastProp.emoji,
                position: toastProp.position ?? "bottom-right",
                duration: toastProp.duration
            });
            break;
        case "promise":
            throw new Error("Due to the way astro renders promise toasts are not available (ish)");
            break;
        case "multiline":
            toast(toastProp.text, {
                style: "background: var(--navbar-color); color: var(--input-text-color);",
                icon: toastProp.emoji,
                position: toastProp.position ?? "bottom-right",
                duration: toastProp.duration
            });
            break;
        default:
            throw new Error("Something isn't right...");
            break;
    }
}
</script>
<!-- A hacky way to get this to be called. Just click this button (preferably via an EVENT) (see ../../utils/toast.ts) -->
<button id={toastProp.id} class:invisible={'invisible'} class:hidden={'hidden'} class={toastProp.class} on:click={() => {return handleToast(toastProp)}}>Auto clicked for toast notifs</button>
