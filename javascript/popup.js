
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
port.onMessage.addListener((message, sender) => {
    console.log(message.status);
});

document.getElementById("start-page-analysis").addEventListener("click", () => {
    port.postMessage({ action: "start-page-analysis" });
});

document.getElementById("start-record").addEventListener("click", () => {

    let file_name;

    if (data.length > 0) {

        file_name = data + '.json';
        data = '';

    } else {

        let date = new Date();
        let dateStamp = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        let timeStamp = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        file_name = 'script (' + dateStamp + ') (' + timeStamp + ').json';
    }

    port.postMessage({
        action: "start-record",
        file_name: file_name,
        value: '',
    });
});

document.getElementById("stop-record").addEventListener("click", () => {

    port.postMessage({ action: "stop-record" });

    chrome.storage.local.get(null, (result) => {

        let steps = {};

        for (let i = 1; i < result.settings.step_count; i ++) {

            let key = 'step_' + i;
            steps[key] = result[key];
        }

        const settings = {
            url: 'data:application/json;base64,' + btoa(JSON.stringify(steps)),
            filename: 'recorded_scripts/' + result.settings.file_name
        };

        chrome.downloads.download(settings, () => {

            for (let key in result) {
                console.log('\n', key + ': ' + result[key]);
                chrome.storage.local.remove(key);
            }
        });
    });
});

//-------------------------------------

document.getElementById("wait-for-element").addEventListener("click", () => {

    let name = data.includes(':') ? data.substring(lastIndexOf(':') + 1) : '';
    let time = data.includes(':') ? data.substring(0, indexOf(':')) : data;
    time = time.length > 0? time : '1';
    data = '';

    port.postMessage({
        action: "wait-for-element",
        name: name,
        time: time,
        text: ''
    });
});

document.getElementById("match-element-text").addEventListener("click", () => {

    let text = data.includes(':') ? data.substring(0, indexOf(':')) : data;
    let name = data.includes(':') ? data.substring(lastIndexOf(':') + 1) : '';
    data = '';

    port.postMessage({
        action: "match-element-text",
        name: name,
        time: '',
        text: text,
    });
});

document.getElementById("wait").addEventListener("click", () => {

    let time = data.length > 0? data : '1';
    data = '';

    port.postMessage({
        action: "wait",
        name: '',
        time: time,
        text: ''
    });
});

document.getElementById("remove-last-step").addEventListener("click", () => {

    port.postMessage({
        action: "remove-last-step"
    });
});

//-------------------------------------

let data = '';

document.getElementById("data").addEventListener("change", (element) => {
    data = element.target.value;
});

//-------------------------------------

document.getElementById("author").addEventListener("click", () => {
    chrome.tabs.create({ url: document.getElementById("author").getAttribute('href') });
});