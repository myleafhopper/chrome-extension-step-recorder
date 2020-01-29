
document.getElementById("footer-toggle").addEventListener("click", toggleFooter);

function toggleFooter() {

    let footer = document.getElementById('footer');

    if (footer.classList.contains("hide-footer")) {

        footer.classList.remove("hide-footer");
        footer.classList.add("show-footer");
        
    } else {
        
        footer.classList.remove("show-footer");
        footer.classList.add("hide-footer");
    }
}