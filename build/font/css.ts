export const cssContent = `@font-face {
    font-family: 'roboto-obf';
    src: url('roboto-obf.woff2') format('woff2'),
         url('roboto-obf.ttf') format('truetype');
    font-display: block;
    font-weight: normal;
    font-style: normal;
}

:root {
    --ob-font-roboto: 'roboto-obf', sans-serif;
}

body.font-obfuscation-ready * {
    font-family: 'roboto-obf', sans-serif !important;
    font-variant-ligatures: none !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

.ob-p,
body .ob-p,
html .ob-p,
.obfuscated,
body .obfuscated,
html .obfuscated {
    font-family: 'roboto-obf', sans-serif !important;
    font-variant-ligatures: none !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    letter-spacing: 0 !important;
    word-spacing: normal !important;
}

.no-obfuscate,
[data-no-obfuscate],
code,
pre,
script,
style,
[data-lucide],
.lucide,
.lucide-icon,
svg[data-lucide] {
    font-family: inherit !important;
}

input,
textarea,
select,
option {
}

.tab-title,
.menu-text,
.ui-text,
[data-obfuscate] {
    font-family: 'roboto-obf', sans-serif !important;
    font-variant-ligatures: none !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

.ob-p,
.obfuscated {
    line-height: inherit;
    font-feature-settings: normal !important;
}`;
