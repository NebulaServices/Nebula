function gyatt() {
    return {
        host: 'example.com',
        html: '<script>console.error("GYATT")</script>',
        injectTo: 'head'
    }
}

//We need to return the refrence to the function and NOT the function itself
self.entryFunc = gyatt;
