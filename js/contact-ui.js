/*
 * Contact page UI helper functions.
 * These functions show, hide, and update page elements.
 */

let selectedContactID = 0;
let selectedContactFirstName = "";
let selectedContactLastName = "";
let selectedContactPhone = "";
let selectedContactEmail = "";
let selectedContactButton = null;

function showDashboardMessage(message) {
    document.getElementById("contactSearchResult").innerHTML = message;
}

function showEmptyContacts() {
    document.getElementById("emptyContactsMessage").style.display = "block";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("contactCardDetails").style.display = "none";
    document.getElementById("contactCardDetails").innerHTML = "";
    document.getElementById("contactList").innerHTML = "";
    document.getElementById("contactSearchResult").innerHTML = "";
}

function showContacts(contacts) {
    renderContactsWithDividers(normalizeContacts(contacts));
}

/*
 * Converts API contacts to one consistent frontend shape.
 * This lets the frontend handle both PascalCase API fields and camelCase API fields.
 */
function normalizeContacts(contacts) {
    const normalizedContacts = [];

    for (let i = 0; i < contacts.length; i++) {
        normalizedContacts.push({
            id: contacts[i].ID ?? contacts[i].id,
            firstName: contacts[i].FirstName ?? contacts[i].firstName,
            lastName: contacts[i].LastName ?? contacts[i].lastName,
            phone: contacts[i].Phone ?? contacts[i].phone,
            email: contacts[i].Email ?? contacts[i].email
        });
    }

    return normalizedContacts;
}

function renderContactsWithDividers(contacts) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    if (contacts.length == 0) {
        contactList.innerHTML = '<p class="sidebarEmptyMessage">No contacts found.</p>';
        return;
    }

    contacts.sort(function (a, b) {
        const firstName = (a.lastName + a.firstName).toLowerCase();
        const secondName = (b.lastName + b.firstName).toLowerCase();

        if (firstName < secondName) {
            return -1;
        }

        if (firstName > secondName) {
            return 1;
        }

        return 0;
    });

    let currentLetter = "";

    for (let i = 0; i < contacts.length; i++) {
        let nextLetter = contacts[i].lastName.charAt(0).toUpperCase();

        if (nextLetter == "") {
            nextLetter = "#";
        }

        if (nextLetter != currentLetter) {
            currentLetter = nextLetter;

            const divider = document.createElement("div");
            divider.className = "contactDivider";
            divider.innerHTML = currentLetter;
            contactList.appendChild(divider);
        }

        addContactToList(
            contacts[i].firstName,
            contacts[i].lastName,
            contacts[i].phone,
            contacts[i].email,
            contacts[i].id
        );
    }
}

function addContactToList(firstName, lastName, phone, email, contactID) {
    const contactList = document.getElementById("contactList");
    const newContact = document.createElement("button");
    const fullName = firstName + " " + lastName;

    if (contactID == undefined) {
        contactID = 0;
    }

    newContact.type = "button";
    newContact.className = "contactListButton";
    newContact.innerHTML = fullName;

    newContact.onclick = function () {
        selectedContactButton = newContact;
        selectContact(contactID, firstName, lastName, phone, email);
    };

    contactList.appendChild(newContact);
}

function selectContact(contactID, firstName, lastName, phone, email) {
    selectedContactID = contactID;
    selectedContactFirstName = firstName;
    selectedContactLastName = lastName;
    selectedContactPhone = phone;
    selectedContactEmail = email;

    let contactDetails = "";
    contactDetails += "<h2>" + firstName + " " + lastName + "</h2>";
    contactDetails += "<p>Phone: " + phone + "</p>";
    contactDetails += "<p>Email: " + email + "</p>";
    contactDetails += '<button type="button" id="openEditContactButton" onclick="showEditContactMessage();">Edit Contact</button>';
    contactDetails += '<button type="button" id="openDeleteContactButton" onclick="showDeleteContactMessage();"><span class="material-symbols-outlined">delete</span><span class="deleteButtonText">Delete Contact</span></button>';

    document.getElementById("emptyContactsMessage").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("contactCardDetails").innerHTML = contactDetails;
    document.getElementById("contactCardDetails").style.display = "block";

    showDashboardMessage("");
}

function showAddContactMessage() {
    document.getElementById("emptyContactsMessage").style.display = "none";
    document.getElementById("contactCardDetails").style.display = "none";
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("addContactForm").style.display = "block";
    document.getElementById("addContactResult").innerHTML = "";
    showDashboardMessage("Fill out the form to add a new contact.");
}

function cancelAddContact() {
    document.getElementById("contactFirstName").value = "";
    document.getElementById("contactLastName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("addContactResult").innerHTML = "";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("contactCardDetails").style.display = "none";
    document.getElementById("emptyContactsMessage").style.display = "block";
    showDashboardMessage("");
}

function showEditContactMessage() {
    if (selectedContactFirstName == "") {
        showDashboardMessage("Select a contact first, then edit contact details here.");
        return;
    }

    if (selectedContactID < 1) {
        showDashboardMessage("This contact must be loaded from the server before it can be edited.");
        return;
    }

    document.getElementById("emptyContactsMessage").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("contactCardDetails").style.display = "none";
    document.getElementById("editContactForm").style.display = "block";

    document.getElementById("editContactFirstName").value = selectedContactFirstName;
    document.getElementById("editContactLastName").value = selectedContactLastName;
    document.getElementById("editContactPhone").value = selectedContactPhone;
    document.getElementById("editContactEmail").value = selectedContactEmail;
    document.getElementById("editContactResult").innerHTML = "";
    showDashboardMessage("Edit the contact and click Update Contact.");
}

function cancelEditContact() {
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("editContactResult").innerHTML = "";

    if (selectedContactFirstName == "") {
        document.getElementById("emptyContactsMessage").style.display = "block";
    }
    else {
        selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
    }
}

function showDeleteContactMessage() {
    if (selectedContactFirstName == "") {
        showDashboardMessage("Select a contact first, then confirm delete here.");
        return;
    }

    if (selectedContactID < 1) {
        showDashboardMessage("This contact must be loaded from the server before it can be deleted.");
        return;
    }

    document.getElementById("emptyContactsMessage").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("editContactForm").style.display = "none";
    document.getElementById("contactCardDetails").style.display = "none";
    document.getElementById("deleteContactForm").style.display = "flex";

    document.getElementById("deleteContactText").innerHTML = "Are you sure you want to delete " + selectedContactFirstName + " " + selectedContactLastName + "?";
    document.getElementById("deleteContactResult").innerHTML = "";
    showDashboardMessage("Confirm delete or cancel.");
}

function cancelDeleteContact() {
    document.getElementById("deleteContactForm").style.display = "none";
    document.getElementById("deleteContactResult").innerHTML = "";

    if (selectedContactFirstName == "") {
        document.getElementById("emptyContactsMessage").style.display = "block";
    }
    else {
        selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
    }
}
