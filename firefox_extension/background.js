// background.js
let iframeVisible = false;

browser.browserAction.onClicked.addListener(async (tab) => {
    if (iframeVisible) {
        await browser.tabs.sendMessage(tab.id, { action: 'hideIframe' });
        iframeVisible = false;
    } else {
        await browser.tabs.sendMessage(tab.id, {
            action: 'showIframe',
            url: tab.url,
            title: tab.title
        });
        iframeVisible = true;
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'iframeHidden') {
        iframeVisible = false;
    }
    if (message.action === 'iframeClosed') {
        iframeVisible = false;
    }
});