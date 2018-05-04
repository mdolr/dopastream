document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('links').innerText = chrome.i18n.getMessage('links');

    chrome.storage.local.get(['notifications'], function(res) {
        if (res.notifications == 2) {
            document.getElementById('checkbox-1').checked = true;
        } else {
            document.getElementById('checkbox-1').checked = false;
        }
    });

    document.getElementById('checkbox-1').addEventListener('click', function(event) {
        if (event.toElement.checked) {
            chrome.storage.local.set({ notifications: 2 });
        } else {
            chrome.storage.local.set({ notifications: 1 });
        }
    });
});