
let contextMenus = {};

contextMenus.getElementLocators =
    chrome.contextMenus.create(
        {
            title: 'Get Element Locators',
            contexts: ['all']
        },
        () => {

            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        }
    );

function createContextMenuHandler(info, tab) {

    if (info.menuItemId === contextMenus.getElementLocators) {
        chrome.tabs.executeScript({ file: 'javascript/print_script.js' });
    }
}

chrome.contextMenus.onClicked.addListener(createContextMenuHandler);

//-------------------------

chrome.runtime.onConnect.addListener(function (port) {

    port.onMessage.addListener(function (message) {

        let variable = message.action === 'start-record'? 'let ' : '';

        chrome.tabs.executeScript({
            code: variable + 'message = ' + JSON.stringify(message)
        }, function () {
            chrome.tabs.executeScript({ file: 'javascript/element_manager.js' });
        });
    });
});