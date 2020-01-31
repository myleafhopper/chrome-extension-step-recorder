{
    let characters = '';

    function recordHandler() {

        if (message.action === 'start-record') {

            document.addEventListener('keydown', evaluateKeyPress);
            document.addEventListener('mousedown', evaluateMouseClick);

        } else if (message.action === 'stop-record') {

            document.removeEventListener('keydown', evaluateKeyPress);
            document.removeEventListener('mousedown', evaluateMouseClick);
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
        console.log(xpath);
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

    recordHandler();
}