// map.js - interactive map of the roastery (Leaflet + OpenStreetMap)

// If the Leaflet library did not load (for example no internet), stop here
if (typeof L === "undefined") {
    document.getElementById("map").textContent = "The map could not be loaded. We are at 4th Avenue, Brixton, Johannesburg.";
    throw new Error("Leaflet not loaded");
}

var roastery = [-26.1937, 28.0036]; // Brixton, Johannesburg

var map = L.map("map", { scrollWheelZoom: false }).setView(roastery, 12);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Circle showing roughly where we deliver (15 km)
L.circle(roastery, { radius: 15000, color: "#9E4A20", fillColor: "#C0973C", fillOpacity: 0.12 })
    .addTo(map)
    .bindTooltip("Johannesburg delivery area (about 15 km)");

L.marker(roastery)
    .addTo(map)
    .bindPopup("<strong>Kwacha Coffee Roasters</strong><br>4th Avenue, Brixton<br>Tue-Sat, 8am-4pm")
    .openPopup();

// Only zoom with the mouse wheel after the map is clicked, so the page still scrolls
map.on("click", function () {
    map.scrollWheelZoom.enable();
});

// "How far am I?" button - only asks for location when it is pressed
var locateButton = document.getElementById("locate-btn");
var locateResult = document.getElementById("locate-result");

if ("geolocation" in navigator) {
    locateButton.hidden = false;

    locateButton.addEventListener("click", function () {
        locateResult.textContent = "Finding your position...";

        navigator.geolocation.getCurrentPosition(function (position) {
            var me = L.latLng(position.coords.latitude, position.coords.longitude);
            var km = me.distanceTo(L.latLng(roastery)) / 1000;

            L.marker(me).addTo(map).bindPopup("You are here").openPopup();
            map.fitBounds(L.latLngBounds([me, roastery]).pad(0.3));

            if (km <= 15) {
                locateResult.textContent = "You are about " + km.toFixed(1) + " km from the roastery - inside our delivery area.";
            } else {
                locateResult.textContent = "You are about " + km.toFixed(1) + " km from the roastery - outside our usual delivery area.";
            }
        }, function () {
            locateResult.textContent = "We couldn't get your location. You can still use the map above.";
        });
    });
}
