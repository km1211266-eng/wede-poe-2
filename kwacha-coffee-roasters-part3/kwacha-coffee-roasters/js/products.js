// products.js - loads the roasts from products.json and lets the visitor
// search, filter and sort them (Our Roasts page)

var list = document.getElementById("roast-list");
var searchBox = document.getElementById("roast-search");
var levelSelect = document.getElementById("roast-filter");
var sortSelect = document.getElementById("roast-sort");
var statusText = document.getElementById("roast-status");
var roasts = [];

// Work out the stock label for a roast
function stockLabel(stock) {
    if (stock <= 0) {
        return '<span class="stock-badge stock-out">Sold out</span>';
    }
    if (stock <= 10) {
        return '<span class="stock-badge stock-low">Low stock - ' + stock + ' bags left</span>';
    }
    return '<span class="stock-badge stock-in">In stock</span>';
}

// Build the HTML for one roast card
function makeCard(roast) {
    var chips = "";
    roast.flavours.forEach(function (flavour) {
        chips += "<li>" + flavour + "</li>";
    });

    var buttonText = roast.stock > 0 ? "Enquire about this roast" : "Ask when it's back";

    return '<article class="roast-entry">' +
        '<div class="roast-entry-head">' +
        "<h2>" + roast.name + "</h2>" +
        '<span class="price">R' + roast.price + " / 250g</span>" +
        "</div>" +
        '<p class="roast-meta">' + roast.origin + " &middot; " + roast.altitude + "m &middot; " +
        roast.process + " &middot; " + roast.roast + " roast</p>" +
        "<p>" + roast.notes + "</p>" +
        '<ul class="flavour-chips">' + chips + "</ul>" +
        stockLabel(roast.stock) +
        '<a class="cta-button-small" href="enquiry.html?roast=' + roast.id + '">' + buttonText + "</a>" +
        "</article>";
}

// Show the roasts that match the search and filter, in the chosen order
function showRoasts() {
    var search = searchBox.value.trim().toLowerCase();
    var level = levelSelect.value;

    var shown = roasts.filter(function (roast) {
        var text = (roast.name + " " + roast.origin + " " + roast.process + " " +
            roast.roast + " " + roast.notes + " " + roast.flavours.join(" ")).toLowerCase();
        var matchesSearch = text.includes(search);
        var matchesLevel = level === "all" || roast.roast === level;
        return matchesSearch && matchesLevel;
    });

    var sortBy = sortSelect.value;
    shown.sort(function (a, b) {
        if (sortBy === "price-asc") { return a.price - b.price; }
        if (sortBy === "price-desc") { return b.price - a.price; }
        if (sortBy === "altitude") { return b.altitude - a.altitude; }
        return a.name.localeCompare(b.name);
    });

    var html = "";
    shown.forEach(function (roast) {
        html += makeCard(roast);
    });
    if (shown.length === 0) {
        html = '<p class="empty-state">No roasts match that search. Try a different word or reset the filters.</p>';
    }
    list.innerHTML = html;
    statusText.textContent = shown.length + (shown.length === 1 ? " roast" : " roasts") + " showing";
}

searchBox.addEventListener("input", showRoasts);
levelSelect.addEventListener("change", showRoasts);
sortSelect.addEventListener("change", showRoasts);

document.getElementById("roast-reset").addEventListener("click", function () {
    searchBox.value = "";
    levelSelect.value = "all";
    sortSelect.value = "name";
    showRoasts();
});

// AJAX: fetch the roast data, then show it
fetch("data/products.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        roasts = data.roasts;
        showRoasts();
    })
    .catch(function () {
        list.innerHTML = "<p>Sorry, the roast list could not be loaded. " +
            'Please try again, or <a href="contact.html">contact us</a>.</p>';
    });
