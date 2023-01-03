
const dbPromise = Ultraviolet.openDB('keyval-store', 1, {
    upgrade(db) {
        db.createObjectStore('keyval');
    },
});

self.storage = {
    async get(key) {
        return (await dbPromise).get('keyval', key);
    },
    
    async set(key, val) {
        return (await dbPromise).put('keyval', val, key);
    },
    
    async del(key) {
        return (await dbPromise).delete('keyval', key);
    },
}

function getBareLocation() {
    const location = storage.get("bareLocation");
    return location;
}

function setBareLocation(location) {
    if (/^http(s?):\/\//.test(location) || (location.includes('.') && val.substr(0, 1) !== ' ') || location.includes('/bare/')) {
        storage.set("bareLocation", location);
        return 'Bare is located at: ' + location;
    } else {
        console.log('Invalid Location provided, please provide a server in the format of http(s)://server.domain.com/');
        return 'Invalid Location provided';
    }
}

function bareValidator(bareLocation) {
    fetch(bareLocation)
        .then((res) => res.json())
        .then((data) => {
            if (data.project.name === "bare-server-node") {
                return true;
            }

            return false;
        })
}


window.addEventListener("load", () => {
    const _loc = document.getElementById('bareLocationInput')
    const indicator = document.getElementById('validIndicator')
    if (bareValidator(_loc.value) === true) {
        indicator.innerText = 'Connected to server: ' + _loc.value
        indicator.style.color = '#42f851'
    } else if (bareValidator(_loc.value) === false) {
        indicator.innerText = 'Could not connect to server: ' + _loc.value
        indicator.style.color = '#f45145bd'
    }

    document.getElementById('bareLocationInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (bareValidator(_loc.value) === true) {
                indicator.innerText = 'Connected to server: ' + _loc.value
                indicator.style.color = '#42f851'
                setBareLocation(_loc.value)
            } else if (bareValidator(_loc.value) === false) {
                indicator.innerText = 'Could not connect to server: ' + _loc.value
                indicator.style.color = '#f45145bd'
            }
        }
    });

});