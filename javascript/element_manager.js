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

            eveulateWaitTime(message.value);

        } else if (message.action === 'remove-last-step') {

            removeLastSavedStep();
        }
    }

    function evaluateKeyPress(event) {

        const list = 'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+=,.<>?/;:"[]{}|\\\'';
        const key = event.key.toLowerCase();
        if (list.indexOf(key) === -1) return;
        characters = characters + event.key;
    }

    function evaluateMouseClick(event) {

        if (event.which !== 1) { return; }
        let element = event.target || event.srcElement;

        if (characters.length > 0) {

            chrome.storage.local.get(null, (result) => {

                let typeStep = getStep('type', result, null, characters);
                characters = '';
                let settings = {
                    'settings': {
                        'step_count': result.settings.step_count + 1,
                        'file_name': result.settings.file_name,
                        'value': ''
                    }
                };

                chrome.storage.local.set(typeStep, () => {
                    chrome.storage.local.set(settings, () => {

                        result.settings.step_count = result.settings.step_count + 1;
                        let clickStep = getStep('click', result, element);
                        saveStep(clickStep, result);
                    });
                });
            });

        } else {

            chrome.storage.local.get(null, (result) => {

                let step = getStep('click', result, element);
                saveStep(step, result);
            });
        }
    }

    function getStep(stepType, result = null, element = null, dataValue = '') {

        let xpath;
        let tagName;
        let description = 'Step ' + result.settings.step_count + ' - ';

        if (stepType == 'click') {

            xpath = getXpath(element);
            tagName = element.tagName;
            description = description + 'Click the ' + tagName + ' element';

        } else if (stepType == 'type') {

            xpath = result['step_' + result.settings.step_count].locator;
            tagName = result['step_' + result.settings.step_count].tag;
            description = description + 'Type (' + dataValue.replace(/[^0-9A-za-z-.]/g, '') +
                ') into the ' + tagName + ' textbox';

        } else if (stepType == 'wait') {

            xpath = '';
            tagName = '';
            description = description + 'Wait for ' + dataValue + ' second(s)';
        }

        let step = {};

        step['step_' + result.settings.step_count] = {
            type: stepType,
            description: description,
            tag: tagName,
            locator: xpath,
            time: getTimeStamp(),
            data: dataValue
        };

        console.log(description);
        return step;
    }

    function saveStep(step, result) {

        chrome.storage.local.set(step, () => {

            chrome.storage.local.set({
                'settings': {
                    'step_count': result.settings.step_count + 1,
                    'file_name': result.settings.file_name,
                    'value': ''
                }
            });
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

    function eveulateWaitTime(dataValue) {

        let seconds;

        try {

            seconds = dataValue.replace(/[^0-9]/g, '');
            seconds = seconds.length > 0 ? seconds : '1';

        } catch (error) {

            seconds = '1';
            console.log('\n*** Wait time provided was not valid. ***\n');
        }

        chrome.storage.local.get(null, (result) => {

            let step = getStep('wait', result, null, seconds);
            saveStep(step, result);
        });
    }

    function removeLastSavedStep() {
        
        chrome.storage.local.get(null, (result) => {

            let key = 'step_' + [result.settings.step_count - 1];
            if (!result.hasOwnProperty(key)) { return; }

            console.log('REMOVED: ' + result[key].description);

            chrome.storage.local.remove(key, () => {
                chrome.storage.local.set({
                    'settings': {
                        'step_count': result.settings.step_count - 1,
                        'file_name': result.settings.file_name,
                        'value': ''
                    }
                });
            });
        });
    }
    
    recordHandler();
}