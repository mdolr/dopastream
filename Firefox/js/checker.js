let stream = 'https://tv.kakao.com/channel/2781080';
let state = false;

browser.notifications.onClicked.addListener(function(notifID) {
    browser.notifications.clear(notifID);
    browser.tabs.create({ url: stream });
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


function createNotification(title) {
    var notification = {
        type: 'basic',
        iconUrl: '../img/live_on.png',
        title: browser.i18n.getMessage('notificationMessage'),
        message: browser.i18n.getMessage('streamTitle') + title
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


browser.storage.local.get(['notifications'], function(res) {
    if (!res.notifications) {
        browser.storage.local.set({ notifications: 2 });
    }
});