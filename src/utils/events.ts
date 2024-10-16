function pageLoad(fn: () => void, logging?: boolean) {
    document.addEventListener("astro:page-load", () => {
        try {
            fn();
        } catch (err) {
            if (logging) {
                console.error(err);
            }
        }
    });
}

export { pageLoad };
