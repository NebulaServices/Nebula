const script = `
console.error('GYATT')
`

self.entryFunc = function(){
    return {
        host: 'example.com',
        html: `<script>${script}</script>`,
        injectTo: 'body'
    }
}
