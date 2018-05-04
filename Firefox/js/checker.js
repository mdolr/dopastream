let stream = 'https://tv.kakao.com/channel/2781080';
let state = false;

// When a button is clicked
browser.notifications.onButtonClicked.addListener(function(notifID, index) {
    // Close the notification
    browser.notifications.clear(notifID);
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
        text: browser.i18n.getMessage('off')
    },

    on: {
        color: '#23e04f',
        path: '../img/live_on_38.png',
        text: browser.i18n.getMessage('on')
    }
};

// Changes the badge depending on live status
function changeBadge(status) {
    browser.browserAction.setBadgeBackgroundColor({
        color: status.color
    });

    browser.browserAction.setIcon({
        path: status.path
    });

    browser.browserAction.setBadgeText({
        text: status.text
    });
}

// Set the badge to off when starting
changeBadge(statusDisplay.off);


function createNotification() {
    var notification = {
        type: 'basic',
        iconUrl: '../img/live_on.png',
        title: browser.i18n.getMessage('notificationMessage'),
        message: '\n',
        buttons: [{
            title: browser.i18n.getMessage('watch')
        }, {
            title: browser.i18n.getMessage('dismiss')
        }],
        isClickable: false
    };

    browser.storage.local.get(['notifications'], function(res) {
        if (res.notifications == 2) {
            browser.notifications.create('', notification);
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
                            stream = data.stream;
                            createNotification();
                            changeBadge(statusDisplay.on);

                        } // if stream turns off
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


browser.storage.local.get(['notifications'], function(res) {
    if (!res.notifications) {
        browser.storage.local.set({ notifications: 2 });
    }
});