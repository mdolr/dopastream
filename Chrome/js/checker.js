let stream = 'https://tv.kakao.com/channel/2781080';
let state = false;

// When a button is clicked
chrome.notifications.onButtonClicked.addListener(function(notifID, index) {
    // Close the notification
    chrome.notifications.clear(notifID);
    // If the watch button has been clicked open the stream.
    if (!index) {
        window.open(stream, '_blank');
    }
});

// Badge styles
let statusDisplay = {
    off: {
        color: '#bfbfbf',
        path: '../img/live_off_38.png',
        text: chrome.i18n.getMessage('off')
    },

    on: {
        color: '#23e04f',
        path: '../img/live_on_38.png',
        text: chrome.i18n.getMessage('on')
    }
};

// Changes the badge depending on live status
function changeBadge(status) {
    chrome.browserAction.setBadgeBackgroundColor({
        color: status.color
    });

    chrome.browserAction.setIcon({
        path: status.path
    });

    chrome.browserAction.setBadgeText({
        text: status.text
    });
}

// Set the badge to off when starting
changeBadge(statusDisplay.off);


function createNotification(title) {
    var notification = {
        type: 'basic',
        iconUrl: '../img/live_on.png',
        title: chrome.i18n.getMessage('notificationMessage'),
        message: chrome.i18n.getMessage('streamTitle') + title,
        buttons: [{
            title: chrome.i18n.getMessage('watch')
        }, {
            title: chrome.i18n.getMessage('dismiss')
        }],
        isClickable: false
    };

    chrome.storage.local.get(['notifications'], function(res) {
        if (res.notifications == 2) {
            chrome.notifications.create('', notification);
        }
    });
}

function getStream() {
    fetch(`http://equinox.ovh:7005`, { method: 'GET' })
        .then(function(res) {
            res
                .json()
                .then(function(data) {
                    if (data.state != state) {
                        // if stream turns on
                        if (data.state) {
                            stream = 'https://tv.kakao.com' + data.link;
                            createNotification(data.title);
                            changeBadge(statusDisplay.on);
                        }
                        // if stream turns off
                        else if (!data.state) {
                            changeBadge(statusDisplay.off);
                        }

                        state = data.state;
                    } else return;
                });
        }, function(err) { console.error(err.message); });
}

getStream();
setInterval(function() { getStream(); }, (300 * 1000));

chrome.storage.local.get(['notifications'], function(res) {
    if (!res.notifications) {
        chrome.storage.local.set({ notifications: 2 });
    }
});