
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

    if (event.keyCode == 9) {
        console.log(characters);
    } else {
        characters = characters + event.key;
    }
}

function evaluateMouseClick(event) {

    characters = '';
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