async function loadVencord() {
    const loadCss = await fetch("https://raw.githubusercontent.com/Vencord/builds/main/browser.css");
    const css = await loadCss.text();
    return {
        host: 'discord.com',
        html: `<style>${css}</script>`,
        injectTo: 'head'
    }
}

self.entryFunc = loadVencord;
