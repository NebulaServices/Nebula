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
                <strong>Success!</strong> Your settings have been saved! 
            </div>
        </div>
        `;
    document.getElementById('navbar').innerHTML = notification
    setTimeout(() => {
        var NotificationOBJ = document.getElementById('notif')

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
    document.getElementById('navbar').innerHTML = notification
    setTimeout(() => {
        var NotificationOBJ = document.getElementById('notif')

    }, 2000);
};

// Update the CheckBox to match the settings 
window.onload = function() {
    console.log("Current Settings: ")
    console.log("NoGG = ", localStorage.getItem('nogg'))

    if (localStorage.getItem('nogg') == 'on') {
        setTimeout(() => {
            var item = document.getElementById("undefined");
            document.getElementById("undefined").checked = true;
        }, 600);

    }
};



function switchProxy() {
    var selecter = document.getElementById("proxySwitcher");
    var selectedOption = selecter.value
    localStorage.setItem("proxy", selectedOption);
    var storedChoice = localStorage.getItem('proxy');
    console.log(selectedOption)

}