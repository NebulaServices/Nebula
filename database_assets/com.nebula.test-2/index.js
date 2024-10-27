const example = () => {console.log('Gyatt... 2')};

function gyatt2() {
    return {
        function: example,
        name: 'gyatt2',
        events: ['fetch']
    };
}

//We need to return the refrence to the function and NOT the function itself
self.entryFunc = gyatt2;
