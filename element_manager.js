
let characters = '';

if (document.addEventListener) {

    document.addEventListener('keydown', (event) => {
        evaluateKeyPress(event);
    });
}

if (document.addEventListener) {

    document.addEventListener('mousedown', (event) => {
        evaluateMouseClick(event);
    });
}

function evaluateKeyPress(event) {

    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+=,.<>?/;:"[]{}|\\\'';
    const key = event.key.toLowerCase();
    if (charList.indexOf(key) === -1) return;
    characters = characters + event.key;
}

function evaluateMouseClick(event) {

    if (characters.length > 0) {
        
        console.log(characters);
        characters = '';
    }

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