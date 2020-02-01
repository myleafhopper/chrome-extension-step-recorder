{
    let characters = '';

    function recordHandler() {

        let dash = '-';

        if (message.action === 'start-page-analysis') {

            document.addEventListener('keydown', evaluateKeyPress);
            document.addEventListener('mousedown', evaluateMouseClick);
            console.log('---> Page Analyzer Activated <---');

        } else if (message.action === 'start-record') {

            console.log(dash.repeat(30));
            console.log('Recording Started...');
            console.log(dash.repeat(30));

            chrome.storage.local.set({ 
                'settings': {
                    'step_count': 1,
                    'file_name': message.file_name
                }
            });

        } else if (message.action === 'stop-record') {

            console.log(dash.repeat(30));
            console.log('Recording Stopped...');
            console.log(dash.repeat(30));
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

        chrome.storage.local.get(null, (result) => {

            let description = 'Step ' + result.settings.step_count + ' - Click the target ' + target.tagName + ' element';
            let step_identifier = 'step_' + result.settings.step_count;
            let step = {};

            step[step_identifier] = {
                description: description,
                locator: xpath,
                type: 'xpath',
                time: getTimeStamp(),
                data: ''
            };

            console.log(description);
            chrome.storage.local.set(step);
            chrome.storage.local.set({ 
                'settings': {
                    'step_count': result.settings.step_count + 1,
                    'file_name': result.settings.file_name
                }
            });
        });
    }

    function getPathTo(element) {

        if (element.id !== '') {
            return "//*[@id='" + element.id + "']";
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