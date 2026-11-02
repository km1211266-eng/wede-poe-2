// main.js - small things used on every page
// "Open now" badge and next roast day (home and contact pages)

// ---------- Opening hours ----------
// The roastery is open Tuesday to Saturday, 8am to 4pm (Johannesburg time).
function getJoburgTime() {
    var text = new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" });
    var now = new Date(text);
    return { day: now.getDay(), hour: now.getHours() + now.getMinutes() / 60 };
}

var pill = document.getElementById("open-pill");
if (pill) {
    var time = getJoburgTime();
    var openDay = time.day >= 2 && time.day <= 6; // 2 = Tuesday, 6 = Saturday
    var message;

    if (openDay && time.hour >= 8 && time.hour < 16) {
        message = "Open now - closes at 4pm";
        pill.classList.add("is-open");
    } else if (openDay && time.hour < 8) {
        message = "Closed - opens today at 8am";
    } else {
        message = "Closed - opens Tuesday at 8am";
    }
    document.getElementById("open-text").textContent = message;
}

// The drum runs on Wednesdays (3) and Fridays (5).
var nextRoast = document.getElementById("next-roast");
if (nextRoast) {
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var today = getJoburgTime().day;
    var daysAway = 0;

    while (daysAway < 7) {
        var d = (today + daysAway) % 7;
        if (d === 3 || d === 5) {
            break;
        }
        daysAway++;
    }
    nextRoast.textContent = dayNames[(today + daysAway) % 7];
    document.getElementById("next-roast-note").textContent =
        daysAway === 0 ? "roasting today" : "next roast day - in " + daysAway + " days";
}
