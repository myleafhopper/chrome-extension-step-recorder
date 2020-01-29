
document.getElementById("footer-toggle").addEventListener("click", toggleFooter);

function toggleFooter() {

    let footer = document.getElementById('footer');
    switchClasses(footer, "hide-footer", "show-footer");
}

function switchClasses(element, class1, class2) {

    if (element.classList.contains(class1)) {

        footer.classList.remove(class1);
        footer.classList.add(class2);

    } else {

        footer.classList.remove(class2);
        footer.classList.add(class1);
    }
}