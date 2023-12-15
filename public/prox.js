document.addEventListener('DOMContentLoaded', (e) => {
  const input = document.getElementById('proxinp')
  const frame = document.getElementById('homeFrame')
  const useDyn = localStorage.getItem('useDynamic') // Set this up once you guys get a settings page ready\
  const searchEngine = localStorage.getItem('searchEngine') || 'https://google.com/search?q='
  input.addEventListener('keydown', (e) =>{
    if (e.key === "Enter") {
      if (useDyn === 'true') {
        frame.className = 'font-roboto w-max h-max'
        console.log('Dynamic Moment :trolley:')
      } else {
        frame.className = 'font-roboto w-max h-max'
        if (input.contains === 'http') {
          const output = Ultraviolet.codec.xor.encode(input)
          frame.src = window.location.origin + '/service/' + output;
        } else {
          const output = Ultraviolet.codec.xor.encode(searchEngine + input)
          frame.src = window.location.origin + '/service/' + output;
        }
        console.log('Yes')
      }
    }
  })
})

// Note for whoever is modifying this
// This is not done and feel free to modify it!