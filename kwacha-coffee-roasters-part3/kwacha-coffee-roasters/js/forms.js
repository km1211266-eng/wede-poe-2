// forms.js - checks the enquiry form and the contact form before they are sent
// Used by enquiry.html and contact.html

var RECIPIENT = "hello@kwachacoffee.co.za";                       // where contact messages go
var AJAX_URL = "https://jsonplaceholder.typicode.com/posts";      // demo address - replace with a real form service

// ---------- Small helpers ----------

// Show an error under a field. Returns true if the field is OK.
function setError(field, errorText) {
    document.getElementById(field.id + "-error").textContent = errorText;
    if (errorText) {
        field.classList.add("invalid");
        field.setAttribute("aria-invalid", "true");
    } else {
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
    }
    return errorText === "";
}

// Each check returns an error message, or "" if the value is fine
function checkName(field) {
    var value = field.value.trim();
    if (value.length < 2) {
        return setError(field, "Please enter your full name (at least 2 characters).");
    }
    if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F '.-]*$/.test(value)) {
        return setError(field, "Names can only contain letters, spaces, apostrophes, full stops and hyphens.");
    }
    return setError(field, "");
}

function checkEmail(field) {
    var value = field.value.trim();
    if (value === "") {
        return setError(field, "Please enter your email address.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return setError(field, "That doesn't look like a valid email address (e.g. name@example.com).");
    }
    return setError(field, "");
}

// South African numbers: 0821234567, 082 123 4567 or +27 82 123 4567
function checkPhone(field, optional) {
    var value = field.value.trim();
    if (value === "") {
        return setError(field, optional ? "" : "Please enter a phone number.");
    }
    var digits = value.replace(/[\s()-]/g, "");
    if (!/^(\+27|0)[1-9][0-9]{8}$/.test(digits)) {
        return setError(field, "Use a South African number, e.g. 082 123 4567 or +27 82 123 4567.");
    }
    return setError(field, "");
}

function checkChoice(field) {
    return setError(field, field.value === "" ? "Please choose an option." : "");
}

// Check every field in the list. Focus the first one that is wrong.
function checkAll(checks) {
    var allGood = true;
    var firstBad = null;
    checks.forEach(function (check) {
        if (!check.run()) {
            allGood = false;
            if (!firstBad) {
                firstBad = check.field;
            }
        }
    });
    if (firstBad) {
        firstBad.focus();
    }
    return allGood;
}

// Send data to the server with AJAX (fetch)
function sendWithAjax(data) {
    return fetch(AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Server replied " + response.status);
        }
        return response.json();
    });
}

// ---------- Contact form ----------
var contactForm = document.getElementById("contact-form");

if (contactForm) {
    var contactName = document.getElementById("name");
    var contactEmail = document.getElementById("email");
    var contactPhone = document.getElementById("phone");
    var contactType = document.getElementById("type");
    var contactSubject = document.getElementById("subject");
    var contactMessage = document.getElementById("message");
    var counter = document.getElementById("message-count");
    var contactFeedback = document.getElementById("contact-feedback");

    function checkSubject() {
        var length = contactSubject.value.trim().length;
        if (length < 3) {
            return setError(contactSubject, "Please add a short subject (at least 3 characters).");
        }
        return setError(contactSubject, "");
    }

    function checkMessage() {
        var length = contactMessage.value.trim().length;
        if (length < 20) {
            return setError(contactMessage, "Please write at least 20 characters so we can help properly (" + length + "/20).");
        }
        return setError(contactMessage, "");
    }

    var contactChecks = [
        { field: contactName, run: function () { return checkName(contactName); } },
        { field: contactEmail, run: function () { return checkEmail(contactEmail); } },
        { field: contactPhone, run: function () { return checkPhone(contactPhone, true); } },
        { field: contactType, run: function () { return checkChoice(contactType); } },
        { field: contactSubject, run: checkSubject },
        { field: contactMessage, run: checkMessage }
    ];

    // Check each field when the visitor leaves it
    contactChecks.forEach(function (check) {
        check.field.addEventListener("blur", check.run);
    });

    // Live character counter
    contactMessage.addEventListener("input", function () {
        counter.textContent = contactMessage.value.length + " / 600";
    });

    // Put a message and a button in the feedback box
    function showContactFeedback(kind, text, linkText, linkHref) {
        contactFeedback.className = "form-feedback is-" + kind;
        contactFeedback.innerHTML = "<p>" + text + "</p>";
        if (linkHref) {
            contactFeedback.innerHTML += '<a class="cta-button-small" href="' + linkHref + '">' + linkText + "</a>";
        }
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!checkAll(contactChecks)) {
            showContactFeedback("error", "Please fix the highlighted fields and try again.");
            return;
        }

        var data = {
            name: contactName.value.trim(),
            email: contactEmail.value.trim(),
            phone: contactPhone.value.trim(),
            type: contactType.value,
            subject: contactSubject.value.trim(),
            message: contactMessage.value.trim()
        };

        // Compile everything into an email the visitor can send
        var body = "Hello Kwacha Coffee Roasters,\n\n" + data.message +
            "\n\nName: " + data.name + "\nEmail: " + data.email +
            (data.phone ? "\nPhone: " + data.phone : "") + "\nMessage type: " + data.type;
        var mailto = "mailto:" + RECIPIENT +
            "?subject=" + encodeURIComponent("[" + data.type + "] " + data.subject) +
            "&body=" + encodeURIComponent(body);

        var button = contactForm.querySelector("button[type=submit]");
        button.disabled = true;
        button.textContent = "Sending...";

        sendWithAjax(data)
            .then(function () {
                showContactFeedback("success",
                    "Thanks, " + data.name.split(" ")[0] + "! Your message is ready. Press the button to send it from your email app to " + RECIPIENT + ".",
                    "Open email and send", mailto);
                contactForm.reset();
                counter.textContent = "0 / 600";
            })
            .catch(function () {
                // The server could not be reached, but the email link still works
                showContactFeedback("error",
                    "We couldn't reach the server, but you can still send your message by email:",
                    "Send by email instead", mailto);
            })
            .then(function () {
                button.disabled = false;
                button.textContent = "Send message";
            });
    });
}

// ---------- Enquiry form ----------
var enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
    var enqName = document.getElementById("name");
    var enqEmail = document.getElementById("email");
    var enqPhone = document.getElementById("phone");
    var enqType = document.getElementById("type");
    var enqRoast = document.getElementById("roast");
    var enqQuantity = document.getElementById("quantity");
    var enqGrind = document.getElementById("grind");
    var enqResult = document.getElementById("enquiry-result");
    var shop = null; // roast data and prices, loaded from products.json

    function checkQuantity() {
        var amount = Number(enqQuantity.value);
        if (enqQuantity.value === "") {
            return setError(enqQuantity, "Please enter how many bags you need.");
        }
        if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
            return setError(enqQuantity, "Quantity must be a whole number from 1 to 100.");
        }
        return setError(enqQuantity, "");
    }

    var enquiryChecks = [
        { field: enqName, run: function () { return checkName(enqName); } },
        { field: enqEmail, run: function () { return checkEmail(enqEmail); } },
        { field: enqPhone, run: function () { return checkPhone(enqPhone, false); } },
        { field: enqType, run: function () { return checkChoice(enqType); } },
        { field: enqRoast, run: function () { return checkChoice(enqRoast); } },
        { field: enqQuantity, run: checkQuantity },
        { field: enqGrind, run: function () { return checkChoice(enqGrind); } }
    ];

    enquiryChecks.forEach(function (check) {
        check.field.addEventListener("blur", check.run);
    });

    // AJAX: load the roasts to fill the dropdown and to work out prices
    fetch("data/products.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            shop = data;
            data.roasts.forEach(function (roast) {
                var option = document.createElement("option");
                option.value = roast.id;
                option.textContent = roast.name + " - R" + roast.price + " / 250g";
                enqRoast.appendChild(option);
            });
            // Coming from "Enquire about this roast" picks that roast
            var wanted = new URLSearchParams(window.location.search).get("roast");
            if (wanted) {
                enqRoast.value = wanted;
            }
        });

    enquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();
        enqResult.hidden = true;

        if (!checkAll(enquiryChecks) || shop === null) {
            return;
        }

        var roast = shop.roasts.find(function (r) {
            return r.id === enqRoast.value;
        });
        var quantity = Number(enqQuantity.value);
        var delivery = enquiryForm.elements.delivery.value; // "collection" or "delivery"
        var isWholesale = enqType.value === "Wholesale";

        // Work out the price
        var subtotal = roast.price * quantity;
        var discount = 0;
        if (isWholesale && quantity >= shop.wholesaleMinBags) {
            discount = subtotal * shop.wholesaleDiscount;
        }
        var deliveryFee = 0;
        if (delivery === "delivery" && subtotal - discount < shop.freeDeliveryOver) {
            deliveryFee = shop.deliveryFee;
        }
        var total = subtotal - discount + deliveryFee;

        // Work out the availability message
        var availability;
        if (roast.stock <= 0) {
            availability = roast.name + " is sold out right now. We'll email " + enqEmail.value.trim() + " as soon as the next roast is bagged.";
        } else if (quantity > roast.stock) {
            availability = "We only have " + roast.stock + " bags of " + roast.name + " right now. We can supply those now and the rest from the next roast (Wednesday or Friday).";
        } else if (delivery === "delivery") {
            availability = "Good news, " + roast.name + " is available. We deliver within Johannesburg within 2 working days.";
        } else {
            availability = "Good news, " + roast.name + " is available. Your bags will be held for collection, Tuesday to Saturday, 8am-4pm.";
        }

        // Show the quote
        var html = "<h2>Thanks, " + enqName.value.trim().split(" ")[0] + "! Here's your quote</h2>";
        html += '<dl class="quote">';
        html += "<dt>Roast</dt><dd>" + roast.name + "</dd>";
        html += "<dt>Quantity</dt><dd>" + quantity + " x 250g @ R" + roast.price + "</dd>";
        html += "<dt>Subtotal</dt><dd>R" + subtotal.toFixed(2) + "</dd>";
        if (discount > 0) {
            html += "<dt>Wholesale discount (15%)</dt><dd>-R" + discount.toFixed(2) + "</dd>";
        }
        html += "<dt>" + (delivery === "delivery" ? "Delivery" : "Collection") + "</dt><dd>" +
            (deliveryFee > 0 ? "R" + deliveryFee : "Free") + "</dd>";
        html += '<dt class="quote-total">Estimated total</dt><dd class="quote-total">R' + total.toFixed(2) + "</dd>";
        html += "</dl>";
        html += "<p>" + availability + "</p>";
        html += '<p class="form-note">This is an estimate. We will confirm the final price by email within two working days.</p>';

        enqResult.innerHTML = html;
        enqResult.hidden = false;
        enqResult.focus();

        // AJAX: also send the enquiry to the server in the background
        sendWithAjax({
            name: enqName.value.trim(),
            email: enqEmail.value.trim(),
            phone: enqPhone.value.trim(),
            type: enqType.value,
            roast: roast.id,
            quantity: quantity,
            delivery: delivery,
            grind: enqGrind.value,
            notes: enquiryForm.elements.notes.value.trim(),
            estimatedTotal: total
        }).catch(function () {
            // The visitor already has their quote, so there is nothing else to do
        });
    });
}
