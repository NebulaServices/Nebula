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
console.log(localStorage.getItem('nogg'))


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

    localStorage.setItem("theme", selectedOption);
    var storedChoice = localStorage.getItem('theme');
    console.log(selectedOption)
    if (storedChoice == 'light') {
        //LIGHT
        console.log("loaded theme:", storedChoice);
        document.body.style.backgroundColor = " #d8d8d8";
        const descriptions = document.getElementsByClassName('description');
        for (const element of descriptions) {
            element.style.color = "#000000";
        }
        const names = document.getElementsByClassName('name');
        for (const element of names) {
            element.style.color = "#000000";
        }
        const dropdowns = document.getElementsByClassName('dropdown');
        for (const element of dropdowns) {
            element.style.backgroundColor = "#606b69";
        }
        const buttons = document.getElementsByClassName('button-save');
        for (const element of buttons) {
            element.style.backgroundColor = "#606b69";
        }
        const switches = document.getElementsByClassName('toogle-button');
        for (const element of switches) {
            element.style.backgroundColor = "#606b69";
        }
        //DARK
    } else if (storedChoice == 'dark') {
        console.log("loaded theme:", storedChoice);
        document.body.style.backgroundColor = "#191724";
        const descriptions = document.getElementsByClassName('description');
        for (const element of descriptions) {
            element.style.color = "#6e6a86";
        }
        const names = document.getElementsByClassName('name');
        for (const element of names) {
            element.style.color = "#e0def4";
        }
        const dropdowns = document.getElementsByClassName('dropdown');
        for (const element of dropdowns) {
            element.style.backgroundColor = "#1abc9c";
        }
        const buttons = document.getElementsByClassName('button-save');
        for (const element of buttons) {
            element.style.backgroundColor = "#1abc9c";
        }
        const switches = document.getElementsByClassName('toogle-button');
        for (const element of switches) {
            element.style.backgroundColor = "#1abc9c";

        }
        document.getElementById('navbar').style.backgroundColor = "#26233a";
        var storedChoice = localStorage.getItem('theme');
    } else if (storedChoice == 'hacker') {
        console.log("loaded theme:", storedChoice);
        document.body.style.backgroundColor = "#000";
        const descriptions = document.getElementsByClassName('description');
        for (const element of descriptions) {
            element.style.color = "#00ff0b";
        }
        const names = document.getElementsByClassName('name');
        for (const element of names) {
            element.style.color = "#00ff0b";
        }
        const dropdowns = document.getElementsByClassName('dropdown');
        for (const element of dropdowns) {
            element.style.backgroundColor = "#00ff0b";
        }
        const buttons = document.getElementsByClassName('button-save');
        for (const element of buttons) {
            element.style.backgroundColor = "#00ff0b";
        }
        const switches = document.getElementsByClassName('toogle-button');
        for (const element of switches) {
            element.style.backgroundColor = "#00ff0b";

        }
        const boxes = document.getElementsByClassName('settings-cont');
        for (const element of boxes) {
            element.style.border = "2px solid rgb(0, 255, 11)";

        }
        const newTags = document.getElementsByClassName('new-tag');
        for (const element of newTags) {
            element.style.color = "#00ff0b";

        }
        document.getElementById('navbar').style.backgroundColor = "#000";
        const navbuttons = document.getElementsByClassName('a-navbutton');
        for (const element of navbuttons) {
            element.style.color = "#00ff0b";
        }
        const nebheader = document.getElementsByClassName('nebHeader');
        for (const element of nebheader) {
            element.style.color = "#00ff0b";
        }
        const Obox = document.getElementsByClassName('omnibox');
        for (const element of Obox) {
            element.style.backgroundColor = "black";
        }
    };
    location.reload()


};

function getOption(option) {
    console.log(localStorage.getItem(option));
}

window.onload = function() {
    // Update the CheckBox to match the settings 
    console.log("Current Settings: ")
    console.log("NoGG = ", localStorage.getItem('nogg'))
    if (window.location.pathname == '/static/options/' || window.location.pathname == 'options/' || window.location.pathname == '/options/') {
        if (localStorage.getItem('nogg') == 'on') {
            setTimeout(() => {
                var item = document.getElementById("undefined");
                document.getElementById("undefined").checked = true;
            }, 600);
        }

        // Update the front end to match option localstorage
        var selecter = document.getElementById("proxySwitcher");
        var storedChoice = localStorage.getItem('proxy');
        selecter.value = storedChoice;

        // ThemeSet
        var themeSelector = document.getElementById("themeSwitcher");
        var storedTheme = localStorage.getItem('theme');
        themeSelector.value = storedTheme;
    }
    if (window.location.pathname == '/static/options/' || window.location.pathname == 'options/' || window.location.pathname == '/options/') {
        if (storedTheme == 'light') {
            console.log("loaded theme:", storedTheme);
            document.body.style.backgroundColor = " #d8d8d8";
            const descriptions = document.getElementsByClassName('description');
            for (const element of descriptions) {
                element.style.color = "#000000";
            }
            const names = document.getElementsByClassName('name');
            for (const element of names) {
                element.style.color = "#000000";
            }
            const dropdowns = document.getElementsByClassName('dropdown');
            for (const element of dropdowns) {
                element.style.backgroundColor = "#606b69";
            }
            const buttons = document.getElementsByClassName('button-save');
            for (const element of buttons) {
                element.style.backgroundColor = "#606b69";
            }
            const switches = document.getElementsByClassName('toogle-button');
            for (const element of switches) {
                element.style.backgroundColor = "#606b69";
            }
        } else if (storedTheme == 'dark') {
            console.log("loaded theme:", storedTheme);
            document.body.style.backgroundColor = "#191724";
            const descriptions = document.getElementsByClassName('description');
            for (const element of descriptions) {
                element.style.color = "#6e6a86";
            }
            const names = document.getElementsByClassName('name');
            for (const element of names) {
                element.style.color = "#e0def4";
            }
            const dropdowns = document.getElementsByClassName('dropdown');
            for (const element of dropdowns) {
                element.style.backgroundColor = "#1abc9c";
            }
            const buttons = document.getElementsByClassName('button-save');
            for (const element of buttons) {
                element.style.backgroundColor = "#1abc9c";
            }
            const switches = document.getElementsByClassName('toogle-button');
            for (const element of switches) {
                element.style.backgroundColor = "#1abc9c";

            }
            document.getElementById('navbar').style.backgroundColor = "#26233a";
        } else if (storedTheme == 'hacker') {
            console.log("loaded theme:", storedChoice);
            document.body.style.backgroundColor = "#000";
            const descriptions = document.getElementsByClassName('description');
            for (const element of descriptions) {
                element.style.color = "#00ff0b";
            }
            const names = document.getElementsByClassName('name');
            for (const element of names) {
                element.style.color = "#00ff0b";
            }
            const dropdowns = document.getElementsByClassName('dropdown');
            for (const element of dropdowns) {
                element.style.backgroundColor = "#00ff0b";
            }
            const buttons = document.getElementsByClassName('button-save');
            for (const element of buttons) {
                element.style.backgroundColor = "#00ff0b";
            }
            const switches = document.getElementsByClassName('toogle-button');
            for (const element of switches) {
                element.style.backgroundColor = "#00ff0b";

            }
            const boxes = document.getElementsByClassName('settings-cont');
            for (const element of boxes) {
                element.style.border = "2px solid rgb(0, 255, 11)";

            }
            const newTags = document.getElementsByClassName('new-tag');
            for (const element of newTags) {
                element.style.color = "#00ff0b";

            }
            document.getElementById('navbar').style.backgroundColor = "#000";
            const navbuttons = document.getElementsByClassName('a-navbutton');
            for (const element of navbuttons) {
                element.style.color = "#00ff0b";
            }
            const nebheader = document.getElementsByClassName('nebHeader');
            for (const element of nebheader) {
                element.style.color = "#00ff0b";
            }
            const Obox = document.getElementsByClassName('omnibox');
            for (const element of Obox) {
                element.style.backgroundColor = "black";
            }
        };
    };
    var storedTheme = localStorage.getItem('theme');
    if (storedTheme == "light") {

        document.getElementById('navbar').style.backgroundColor = "#a2a2a2";
        document.body.style.backgroundColor = " #d8d8d8";
        const navbuttons = document.getElementsByClassName('a-navbutton');
        for (const element of navbuttons) {
            element.style.color = "#000000";
        }
        const nebheader = document.getElementsByClassName('nebHeader');
        for (const element of nebheader) {
            element.style.color = "#000000";
        }
        const Obox = document.getElementsByClassName('omnibox');
        for (const element of Obox) {
            element.style.backgroundColor = "#000000";
        }
        const stamp = document.getElementsByClassName('stamp');
        for (const element of stamp) {
            element.style.color = "#000";
        }
    } else if (storedTheme == 'dark') {
        document.getElementById('navbar').style.backgroundColor = "#26233a";
        document.body.style.backgroundColor = "#191724";


    } else if (storedTheme == 'hacker') {
        console.log("loaded theme:", storedChoice);
        document.body.style.backgroundColor = "#000";
        const descriptions = document.getElementsByClassName('description');
        for (const element of descriptions) {
            element.style.color = "#00ff0b";
        }
        const names = document.getElementsByClassName('name');
        for (const element of names) {
            element.style.color = "#00ff0b";
        }
        const dropdowns = document.getElementsByClassName('dropdown');
        for (const element of dropdowns) {
            element.style.backgroundColor = "#00ff0b";
        }
        const buttons = document.getElementsByClassName('button-save');
        for (const element of buttons) {
            element.style.backgroundColor = "#00ff0b";
        }
        const switches = document.getElementsByClassName('toogle-button');
        for (const element of switches) {
            element.style.backgroundColor = "#00ff0b";

        }
        const boxes = document.getElementsByClassName('settings-cont');
        for (const element of boxes) {
            element.style.border = "2px solid rgb(0, 255, 11)";

        }
        const newTags = document.getElementsByClassName('new-tag');
        for (const element of newTags) {
            element.style.color = "#00ff0b";
        }
        document.getElementById('navbar').style.backgroundColor = "#000";
        const navbuttons = document.getElementsByClassName('a-navbutton');
        for (const element of navbuttons) {
            element.style.color = "#00ff0b";
        }
        const nebheader = document.getElementsByClassName('nebHeader');
        for (const element of nebheader) {
            element.style.color = "#00ff0b";
        }
        const Obox = document.getElementsByClassName('omnibox');
        for (const element of Obox) {
            element.style.backgroundColor = "black";
        }
        document.getElementById('navbar').style.backgroundColor = "#000";
    }
};