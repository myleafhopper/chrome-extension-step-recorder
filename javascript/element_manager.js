{
    let characters = '';

    function recordHandler() {

        let dash = '-';

        if (message.action === 'start-page-analysis') {

            document.addEventListener('keydown', evaluateKeyPress);
            document.addEventListener('mousedown', evaluateMouseClick);
            console.log('---> Page Analyzer Activated <---');

        } else if (message.action === 'start-record') {

            chrome.storage.local.set({
                'settings': {
                    'step_count': 1,
                    'file_name': message.file_name,
                    'value': ''
                }
            });

            console.log(dash.repeat(30));
            console.log('Recording Started...');
            console.log(dash.repeat(30));

        } else if (message.action === 'stop-record') {

            console.log(dash.repeat(30));
            console.log('Recording Stopped...');
            console.log(dash.repeat(30));

        } else if (message.action === 'wait') {

            try {
                seconds = Number(data);
                seconds = seconds > 0 ? seconds : 1;
            } catch (error) {
                alert('Wait time provided was not valid.');
            }
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
        let element = event.target || event.srcElement;

        chrome.storage.local.get(null, (result) => {

            let step = getStep('click', result, element);
            saveStep(step, result);
        });
    }

    function getStep(stepType, result = null, element = null) {

        let description = 'Step ' + result.settings.step_count + ' - ';
        let xpath = '';

        if (stepType == 'click') {

            description = description + 'Click the ' + element.tagName + ' element';
            xpath = getXpath(element);
        }

        let step = {};

        step['step_' + result.settings.step_count] = {
            description: description,
            locator: xpath,
            time: getTimeStamp(),
            data: ''
        };

        console.log(description);
        return step;
    }

    function saveStep(step, result) {

        chrome.storage.local.set(step);
        chrome.storage.local.set({
            'settings': {
                'step_count': result.settings.step_count + 1,
                'file_name': result.settings.file_name,
                'value': ''
            }
        });
    }

    function getXpath(element) {

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
                return getXpath(element.parentNode) + '/' + element.tagName + '[' + (nodeIndex + 1) + ']';
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