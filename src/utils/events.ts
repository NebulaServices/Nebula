function pageLoad(fn: () => void) {
    document.addEventListener("astro:page-load", () => {
        try {
            fn();
        }
        catch (err) { /* DEBUGGING ONLY: console.error(err) */ }
    });
}

export { pageLoad };
