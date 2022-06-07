var option = localStorage.getItem('nogg');



window.addEventListener('load', () => {
  
      
    function isUrl(val = '') {
        if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
        return false;
    };

    // NOGG
    const useNoGG = false;
    const proxy = localStorage.getItem("proxy") || "uv"

    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();

        if (typeof navigator.serviceWorker === 'undefined')
            alert('Your browser does not support service workers or you are in private browsing!');
        if (proxy == 'uv'){
        navigator.serviceWorker.register('./sw.js', {
            scope: __uv$config.prefix
        }).then(() => {
            const value = event.target.firstElementChild.value;

            let url = value.trim();
            if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
            if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
            let redirectTo = __uv$config.prefix + __uv$config.encodeUrl(url);
            const option = localStorage.getItem('nogg');
            if (option === 'on') { 
                stealthEngine(redirectTo);
             } else location.href = redirectTo;
        });
    } else if (proxy == 'cyclone') {
     
            const value = event.target.firstElementChild.value;

            let url = value.trim();
            if (!isUrl(url)) url = 'www.google.com/search?q=' + url;
          if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
            let redirectTo = '/service/' + url;
            const option = localStorage.getItem('nogg');
            if (option === 'on') { 
                stealthEngine(redirectTo);
             } else location.href = redirectTo;
      
    }
    });

// NoGG Engine 
function stealthEngine(encodedURL){
    // The URL must be encoded ^ 
    let inFrame
  
  try {
      inFrame = window !== top
  } catch (e) {
      inFrame = true
  }
  
  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
  const popup = open("about:blank", "_blank")
  if (!popup || popup.closed) {
    alert("Popups are disabled!")
  } else {
    const doc = popup.document
    const iframe = doc.createElement("iframe")
    const style = iframe.style
    const img = doc.createElement("link")
    const link = location.href 
    img.rel = "icon"
    img.href = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
    doc.title = "Google Drive"
  
    var currentLink = link.slice(0, link.length - 1);

    iframe.src = currentLink + encodedURL

    style.position = "fixed"
    style.top = style.bottom = style.left = style.right = 0
    style.border = style.outline = "none"
    style.width = style.height = "100%"
  
    doc.body.appendChild(iframe)
      }
  }
}});