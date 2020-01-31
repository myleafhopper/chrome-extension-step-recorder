{
    let characters = '';

    function recordHandler() {

        if (message.action === 'start-page-analysis') {

            document.addEventListener('keydown', evaluateKeyPress);
            document.addEventListener('mousedown', evaluateMouseClick);

        } else if (message.action === 'start-record') {

            console.log('Recording Started...');
            let step_counter = { 'step_count': 1 };
            chrome.storage.local.set(step_counter);

        } else if (message.action === 'stop-record') {

            console.log('Recording Stopped...');
            
            chrome.storage.local.get(null, function (result) {

                for (let key in result) {
                    console.log('\n', key + ': ' + result[key]);
                    chrome.storage.local.remove(key);
                }
            });
        }
    }

    function evaluateKeyPress(event) {

        const list = 'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+=,.<>?/;:"[]{}|\\\'';
        const key = event.key.toLowerCase();
        if (list.indexOf(key) === -1) return;
        characters = characters + event.key;
    }

    function evaluateMouseClick(event) {

        if (characters.length > 0) {

            console.log(characters);
            characters = '';
        }

        if (event.which !== 1) { return; }
        let target = event.target || event.srcElement;
        let xpath = getPathTo(target);

        chrome.storage.local.get('step_count', function (result) {

            let step_identifier = 'step_' + result.step_count;
            let step = {};
            step[step_identifier] = {
                locator: xpath,
                type: 'xpath',
                time: getTimeStamp(),
                data: ''
            };

            chrome.storage.local.set(step);

            let step_counter = { 'step_count': (result.step_count + 1) };
            chrome.storage.local.set(step_counter);
        });
    }

    function getPathTo(element) {

        if (element.id !== '') {
            return '//*[@id="' + element.id + '"]';
        } else if (element === document.body) {
            return element.tagName;
        }

        let nodeIndex = 0;
        let siblings = element.parentNode.childNodes;

        for (let i = 0; i < siblings.length; i++) {

            let sibling = siblings[i];

            if (sibling === element) {
                return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (nodeIndex + 1) + ']';
            }

            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                nodeIndex++;
            }
        }
    }

    function getTimeStamp() {

        const date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

    recordHandler();
}