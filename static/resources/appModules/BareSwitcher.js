// NOTE: THIS FILE MUST BE ACCOMPANIED BY THE ULTRAVIOLET BUNDLE BECAUSE IT CONTAINS THE INDEXEDDB LIBRARY

const dbPromise = Ultraviolet.openDB('keyval-store', 1, {
  upgrade (db) {
    db.createObjectStore('keyval')
  }
})

function getBareLocation () {
  return dbPromise
    .then(db => db.get('keyval', 'bareLocation'))
    .then(value => value || '')
}

self.storage = {
  async get (key) {
    return (await dbPromise).get('keyval', key)
  },

  async set (key, val) {
    return (await dbPromise).put('keyval', val, key)
  },

  async del (key) {
    return (await dbPromise).delete('keyval', key)
  }
}

function setBareLocation (location) {
  if (
    /^http(s?):\/\//.test(location) ||
    (location.includes('.') && val.substr(0, 1) !== ' ') ||
    location.includes('/bare/')
  ) {
    storage.set('bareLocation', location)
    return 'Bare is located at: ' + location
  } else {
    console.log(
      'Invalid Location provided, please provide a server in the format of http(s)://server.domain.com/'
    )
    return 'Invalid Location provided'
  }
}

function bareValidator (bareLocation) {
  try {
    // open a request to the bare location
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', bareLocation, false) // false for synchronous request
    xmlHttp.send(null)
    const _response = xmlHttp.responseText
    // turn the response text into json

    const response = JSON.parse(_response)

    if (response.project.name === 'bare-server-node') {
      console.log('Bare located at: ' + bareLocation + '')
      return true
    } else {
      console.error('Bare not found at: ' + bareLocation)
      return false
    }
  } catch (error) {
    console.error(
      'An error occured while attempting to identify the bare server at: ' +
        bareLocation
    )
    return false
  }
}

window.addEventListener('load', () => {
  console.log('Loaded ')
  const _loc = document.getElementById('bareLocationInput')
  const indicator = document.getElementById('validIndicator')

  // wait 3 seconds
  setTimeout(() => {
    if (bareValidator(_loc.value) === true) {
      indicator.innerText = 'Connected to server: ' + _loc.value
      indicator.style.color = '#42f851'
    } else if (bareValidator(_loc.value) === false) {
      indicator.innerText = 'Could not connect to server: ' + _loc.value
      indicator.style.color = '#f45145bd'
    }
  }, 1000)

  document
    .getElementById('bareLocationInput')
    .addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        if (bareValidator(_loc.value) === true) {
          indicator.innerText = 'Connected to server: ' + _loc.value
          indicator.style.color = '#42f851'
          setBareLocation(_loc.value)
        } else if (bareValidator(_loc.value) === false) {
          _loc.value = ''
          indicator.innerText = 'Could not connect to server: ' + _loc.value
          indicator.style.color = '#f45145bd'
        }
      }
    })
})
