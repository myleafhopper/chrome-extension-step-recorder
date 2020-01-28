
if (document.addEventListener) {

    document.addEventListener('mousedown', (event) => {
        evaluateEvent(event);
    });

} else if (document.addEventListener) {

    document.addEventListener('click', (event) => {
        evaluateEvent(event);
    });

} else if (document.addEventListener) {

    document.addEventListener('onclick', (event) => {
        evaluateEvent(event);
    });

} else if (document.attachEvent) {

    document.attachEvent('onclick', () => {
        evaluateEvent(event);
    });
}

function evaluateEvent(event) {

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