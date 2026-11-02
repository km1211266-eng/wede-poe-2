// about.js - tabs and the photo gallery lightbox (About page)

// ---------- Tabs ----------
var tabs = document.querySelectorAll('[role="tab"]');

function showTab(chosen) {
    tabs.forEach(function (tab) {
        var isChosen = tab === chosen;
        tab.setAttribute("aria-selected", isChosen);
        tab.tabIndex = isChosen ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !isChosen;
    });
}

tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
        showTab(tab);
    });

    // Left and right arrow keys move between tabs
    tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") {
            next = tabs[(index + 1) % tabs.length];
        } else if (event.key === "ArrowLeft") {
            next = tabs[(index - 1 + tabs.length) % tabs.length];
        }
        if (next) {
            showTab(next);
            next.focus();
        }
    });
});

// ---------- Lightbox ----------
var links = document.querySelectorAll("[data-lightbox]");
var lightbox = document.getElementById("lightbox");
var bigImage = document.getElementById("lightbox-img");
var caption = document.getElementById("lightbox-caption");
var current = 0;
var lastClicked = null;

function showImage(index) {
    // wrap around at both ends
    current = (index + links.length) % links.length;
    var link = links[current];
    bigImage.src = link.href;
    bigImage.alt = link.querySelector("img").alt;
    caption.textContent = (current + 1) + " / " + links.length + " - " + link.dataset.caption;
}

function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    document.getElementById("lightbox-close").focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastClicked) {
        lastClicked.focus();
    }
}

links.forEach(function (link, index) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        lastClicked = link;
        openLightbox(index);
    });
});

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", function () {
    showImage(current - 1);
});
document.getElementById("lightbox-next").addEventListener("click", function () {
    showImage(current + 1);
});

// Clicking the dark background closes it too
lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) {
        return;
    }
    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowLeft") {
        showImage(current - 1);
    } else if (event.key === "ArrowRight") {
        showImage(current + 1);
    }
});
