document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('links').innerText = browser.i18n.getMessage('links');


    browser.storage.local.get(['notifications'], function(res) {
        if (res.notifications == 2) {
            document.getElementById('checkbox-1').checked = true;
        } else {
            document.getElementById('checkbox-1').checked = false;
        }
    });

    document.getElementById('checkbox-1').addEventListener('click', function(event) {
        if (event.target.checked) {
            browser.storage.local.set({ notifications: 2 });
        } else {
            browser.storage.local.set({ notifications: 1 });
        }
    });
});