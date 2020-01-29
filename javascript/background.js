
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

function meh() {
    console.log('meh');
}