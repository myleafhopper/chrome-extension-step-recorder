
document.getElementById("credits-toggle").addEventListener("click", toggleCredits);

function toggleCredits() {

    let credits = document.getElementById('credits');
    switchClasses(credits, "hide", "show");
}

function toggleStartPauseButton() {

    let startRecord = document.getElementById('start-record');
    switchClasses(startRecord, "hide", "show");

    let pauseRecord = document.getElementById('pause-record');
    switchClasses(pauseRecord, "hide", "show");
}

function switchClasses(element, class1, class2) {

    if (element.classList.contains(class1)) {

        element.classList.remove(class1);
        element.classList.add(class2);

    } else {

        element.classList.remove(class2);
        element.classList.add(class1);
    }
}

//-------------------------------------

const port = chrome.runtime.connect({ name: 'sync' });
port.onMessage.addListener(function (message, sender) {
    console.log(message.status);
});

document.getElementById("start-page-analysis").addEventListener("click", () => {
    port.postMessage({ action: "start-page-analysis" });
});

document.getElementById("start-record").addEventListener("click", () => {
    port.postMessage({ action: "start-record" });
});

document.getElementById("stop-record").addEventListener("click", () => {

    port.postMessage({ action: "stop-record" });

    chrome.storage.local.get(null, function (result) {

        let settings = {
            url: 'data:application/json;base64,' + btoa(JSON.stringify(result)),
            filename: 'recorded_script.json'
        };

        chrome.downloads.download(settings, function () {

            for (let key in result) {
                console.log('\n', key + ': ' + result[key]);
                chrome.storage.local.remove(key);
            }

        });
    });
});