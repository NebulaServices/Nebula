// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
//                      Copyright Nebula Services 2021-2022
//                                  Form.js 
//                      For the submission of the URL form to the server. 
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################

var option = localStorage.getItem('nogg');



window.addEventListener('load', () => {


    function isUrl(val = '') {
        if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
        return false;
    };

    // NOGG
    const useNoGG = false;
    const proxy = localStorage.getItem("proxy") || "uv"
    const inpbox = document.querySelector('form');
    inpbox.addEventListener('submit', event => {
        console.log("Connecting to service -> loading");
        const loader = document.getElementById("lpoader");
        const texts = document.getElementById("connecterText");
        const loadConstructer = loader.style;
        const textConstructer = texts.style;
        loadConstructer.display = "flex";
        loadConstructer.justifyContent = "center";
        setTimeout(() => {
            document.getElementById("connecterText").style.fontSize = "12px"
            document.getElementById("connecterText").innerHTML = "Due to high server load, this may take a while.";
        }, 3200);

        setTimeout(() => {
            document.getElementById("connecterText").style.fontSize = "14px"
            document.getElementById("connecterText").innerHTML = "Something's not right here...";
        }, 17000);


    });
    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();

        if (typeof navigator.serviceWorker === 'undefined')
            alert('Your browser does not support service workers or you are in private browsing!');
        if (proxy == 'uv') {
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
    function stealthEngine(encodedURL) {
        // The URL must be encoded ^ 
        let inFrame

        try {
            inFrame = window !== top
        } catch (e) {
            inFrame = true
        }
        setTimeout(() => {
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
        }, 1500);
    }
});



// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
//                      Copyright Nebula Services 2021-2022
//                              settings.js
//                     For the settings of the application.
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################


// Set the option 
var option = localStorage.getItem('nogg')

function toggleNoGG() {
    if (option === 'on') {

        option = 'off';
        localStorage.setItem('nogg', 'off');
    } else {

        option = 'on';
        localStorage.setItem('nogg', 'on');
    }
}






function switchProxy() {
    var selecter = document.getElementById("proxySwitcher");
    var selectedOption = selecter.value

    localStorage.setItem("proxy", selectedOption);
    var storedChoice = localStorage.getItem('proxy');
    console.log(selectedOption)

}


function switchTheme() {
    var selecter = document.getElementById("themeSwitcher");
    var selectedOption = selecter.value
    if (selectedOption == "dark") {
        changeCSS('--background-primary', '#191724', true);
        changeCSS('--navbar-color', '#26233a', true);
        changeCSS('--navbar-height', '60px', true);
        changeCSS('--navbar-text-color', '#4de0fa', true);
        changeCSS('--input-text-color', '#e0def4', true);
        changeCSS('--input-placeholder-color', '#6e6a86', true);
        changeCSS('--input-background-color', '#1f1d2e', true);
        changeCSS('--input-placeholder-color', 'white', true);
        changeCSS('--input-border-color', '#eb6f92', true);
        changeCSS('--input-border-size', '1.3px', true);
        changeCSS('--navbar-link-color', '#e0def4', true);
        changeCSS('--navbar-font', '"Roboto"', true);
        changeCSS('--navbar-logo-filter', 'invert(0%)', true);
        changeCSS('--text-color-primary', '#e0def4', true);
    }
    if (selectedOption == "light") {
        changeCSS('--background-primary', '#d8d8d8', true);
        changeCSS('--navbar-color', '#a2a2a2', true);
        changeCSS('--navbar-height', '4em', true);
        changeCSS('--navbar-text-color', '#000000', true);
        changeCSS('--input-text-color', '#e0def4', true);
        changeCSS('--input-placeholder-color', 'white', true);
        changeCSS('--input-background-color', 'black', true);
        changeCSS('--input-border-color', '#eb6f92', true);
        changeCSS('--input-border-size', '1.3px', true);
        changeCSS('--navbar-link-color', '#000000', true);
        changeCSS('--navbar-font', '"Roboto"', true);
        changeCSS('--navbar-logo-filter', 'invert(30%)', true);
        changeCSS('--text-color-primary', '#303030', true);

    }
    if (selectedOption == "custom") {
        let response = prompt('Please enter the code for a custom theme:', '')
        alert('This feature is not ready yet. Please try again later.')
    };
};

function defaultThemes() {

}

// write a function that will change css variables based on the arguments passed in the function
function changeCSS(variable, value, saveBool) {
    document.documentElement.style.setProperty(variable, value);
    console.log(`Sucessfully changed CSS variable: ${variable} to ${value}`)
    if (saveBool === true) {
        saveCSS(variable, value);
    }
}

function saveCSS(variable, value) {
    localStorage.setItem(variable, value);
    console.log(`Updated CSS LocalStorage: ${localStorage.getItem(variable)}`)

}


window.onload = function() {
    let background = localStorage.getItem('--background-primary');
    let navbar = localStorage.getItem('--navbar-color');
    let navbarHeight = localStorage.getItem('--navbar-height');
    let navbarText = localStorage.getItem('--navbar-text-color');
    let inputText = localStorage.getItem('--input-text-color');
    let inputPlaceholder = localStorage.getItem('--input-placeholder-color');
    let inputBackground = localStorage.getItem('--input-background-color');
    let inputBorder = localStorage.getItem('--input-border-color');
    let inputBorderSize = localStorage.getItem('--input-border-size');
    let navbarFont = localStorage.getItem('--navbar-font');
    let navbarLink = localStorage.getItem('--navbar-link-color');
    let navbarLogoFilter = localStorage.getItem('--navbar-logo-filter');
    let textColorPrimary = localStorage.getItem('--text-color-primary');
    changeCSS('--background-primary', background);
    changeCSS('--navbar-color', navbar);
    changeCSS('--navbar-height', navbarHeight);
    changeCSS('--navbar-text-color', navbarText);
    changeCSS('--input-text-color', inputText);
    changeCSS('--input-placeholder-color', inputPlaceholder);
    changeCSS('--input-background-color', inputBackground);
    changeCSS('--input-border-color', inputBorder);
    changeCSS('--input-border-size', inputBorderSize);
    changeCSS('--navbar-link-color', navbarLink);
    changeCSS('--navbar-font', navbarFont);
    changeCSS('--navbar-logo-filter', navbarLogoFilter);
    changeCSS('--text-color-primary', textColorPrimary);
}

function resetViews() {
    changeCSS('--background-primary', '#191724', true);
    changeCSS('--navbar-color', '#26233a', true);
    changeCSS('--navbar-height', '60px', true);
    changeCSS('--navbar-text-color', '#4de0fa', true);
    changeCSS('--navbar-link-color', '#e0def4', true);
    changeCSS('--navbar-font', '"Roboto"', true);
    changeCSS('--input-text-color', '#e0def4', true);
    changeCSS('--input-placeholder-color', '#6e6a86', true);
    changeCSS('--input-background-color', '#1f1d2e', true);
    changeCSS('--input-placeholder-color', 'white', true);
    changeCSS('--input-border-color', '#eb6f92', true);
    changeCSS('--input-border-size', '1.3px', true);
    return "All views reset"
}

// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
//                                 Device Handling.
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
(function(a, b) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.location = b
})(navigator.userAgent || navigator.vendor || window.opera, 'mobile.html');

// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
//                                 ductwork.js
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
// #################################################################################################################################################
function log() {
    setTimeout(console.log.bind(console, "%cWelcome To Nebula", "background: #3F51B5;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:30px;"));
    setTimeout(console.log.bind(console, "%c If you are seeing this, Nebula's main script has succesfully loaded!", "background: green;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:12px;"));
    setTimeout(console.log.bind(console, "%cIf you encounter an error, contact our support team on discord. Copy and paste the information below and send it in the ticket", "background: red;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:12px;"));
    let enabledCookies = navigator.cookieEnabled;
    let appName = navigator.appName; // @deprecated
    let product = navigator.product; // @deprecated
    let agent = navigator.userAgent;
    let version = navigator.appVersion; // @deprecated
    let platform = navigator.platform; // @deprecated
    let online = navigator.onLine;
    let userAgent = navigator.userAgent;
    let browserName;
    let diagnosticDomain = window.location.href;
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
    } else {
        browserName = "No browser detection";
    }
    setTimeout(console.log.bind(console, `%cInformation: \n URL: ${diagnosticDomain} \n BrowserName: ${browserName} \n IsOnline: ${online} \n agent: ${userAgent}, `, "background: gray;color:#FFF;padding:3px;border-radius: 0px;line-height: 26px; font-size:6px;"));
}

function induce(inductor) {
    if (inductor == "reset") {
        localStorage.setItem('proxy', 'uv')
        localStorage.setItem('theme', 'dark')
        localStorage.setItem('nogg', "off")
        location.reload();
    } else if (inductor == 1) {
        location.reload();
    }
}
log();

// Notification Banner
function saveIc() {
    console.log("Checked")
    var notification = `
            <div class="notification-container" id="notification-container">
            <div class="notification notification-success">
                <strong>Success!</strong> Your settings have been saved - Reloading.
            </div>
        </div>
        `;
    document.getElementById('notifhere').innerHTML = notification
    setTimeout(() => {
        var NotificationOBJ = document.getElementById('notifhere')

    }, 2000);
};

function unsavedChanges() {
    var notification = `
    <div class="notification-container" id="notification-container">
    <div class="notification notification-danger" id="notification-container">
    <strong>Danger!</strong> You have unsaved changes!
</div>
</div>
        `;
    document.getElementById('notifhere').innerHTML = notification
    setTimeout(() => {
        var NotificationOBJ = document.getElementById('notifhere')

    }, 2000);
};