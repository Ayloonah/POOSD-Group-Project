/*
 * Mock contact data.
 * This file is only used when USE_MOCK_CONTACTS is true in config.js.
 */

let mockContacts = [
	{ id: 1, firstName: "John", lastName: "Doe", phone: "111-111-1111", email: "john@test.com" },
	{ id: 2, firstName: "Jane", lastName: "Smith", phone: "222-222-2222", email: "jane@test.com" },
	{ id: 3, firstName: "Mike", lastName: "Brown", phone: "333-333-3333", email: "mike@test.com" },
	{ id: 4, firstName: "Ben", lastName: "Affleck", phone: "444-444-4444", email: "benrunsonduncan@test.com" },
	{ id: 5, firstName: "Matt", lastName: "Damon", phone: "555-555-5555", email: "mattheartsteacher@test.com" },
	{ id: 6, firstName: "Carol", lastName: "Shelby", phone: "666-666-6666", email: "sevenlitersornuthin@test.com" },
	{ id: 7, firstName: "Ken", lastName: "Miles", phone: "777-777-7777", email: "learntodrivepillock@test.com" },
	{ id: 8, firstName: "Christian", lastName: "Bale", phone: "888-888-8888", email: "bestbatman@test.com" },
	{ id: 9, firstName: "Ronald", lastName: "MacDonald", phone: "999-999-9999", email: "burgersaregoodforyou@test.com" },
	{ id: 10, firstName: "SpongeBob", lastName: "SquarePants", phone: "123-456-7890", email: "spongebob@test.com" },
	{ id: 11, firstName: "Chief", lastName: "Keef", phone: "300-300-3000", email: "sosabackfromthedead@test.com" }
];

function loadMockContacts()
{
	renderContactsWithDividers(mockContacts);
	showDashboardMessage("Showing " + mockContacts.length + " test contacts.");
}

function searchMockContacts(searchText)
{
	const filteredContacts = [];
	const lowerSearchText = searchText.toLowerCase();

	for( let i = 0; i < mockContacts.length; i++ )
	{
		if( mockContacts[i].firstName.toLowerCase().includes(lowerSearchText) ||
			mockContacts[i].lastName.toLowerCase().includes(lowerSearchText) ||
			mockContacts[i].phone.includes(searchText) ||
			mockContacts[i].email.toLowerCase().includes(lowerSearchText) )
		{
			filteredContacts.push(mockContacts[i]);
		}
	}

	renderContactsWithDividers(filteredContacts);
	showDashboardMessage("Showing " + filteredContacts.length + " test results for \"" + searchText + "\".");
}

function createMockContact(firstName, lastName, phone, email)
{
	let newContactID = 1;

	for( let i = 0; i < mockContacts.length; i++ )
	{
		if( mockContacts[i].id >= newContactID )
		{
			newContactID = mockContacts[i].id + 1;
		}
	}

	mockContacts.push({
		id: newContactID,
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email
	});

	document.getElementById("addContactResult").innerHTML = "Contact added successfully.";
	document.getElementById("addContactResult").className = "successMessage";

	document.getElementById("contactFirstName").value = "";
	document.getElementById("contactLastName").value = "";
	document.getElementById("contactPhone").value = "";
	document.getElementById("contactEmail").value = "";

	loadMockContacts();
}

function updateMockContact(firstName, lastName, phone, email)
{
	for( let i = 0; i < mockContacts.length; i++ )
	{
		if( mockContacts[i].id == selectedContactID )
		{
			mockContacts[i].firstName = firstName;
			mockContacts[i].lastName = lastName;
			mockContacts[i].phone = phone;
			mockContacts[i].email = email;
		}
	}

	selectedContactFirstName = firstName;
	selectedContactLastName = lastName;
	selectedContactPhone = phone;
	selectedContactEmail = email;

	document.getElementById("editContactResult").innerHTML = "Contact updated successfully.";
	document.getElementById("editContactResult").className = "successMessage";

	loadMockContacts();

	setTimeout(function()
	{
		selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
	}, 2500);
}

function deleteMockContact()
{
	const newMockContacts = [];

	for( let i = 0; i < mockContacts.length; i++ )
	{
		if( mockContacts[i].id != selectedContactID )
		{
			newMockContacts.push(mockContacts[i]);
		}
	}

	mockContacts = newMockContacts;

	document.getElementById("deleteContactResult").innerHTML = "Contact deleted successfully.";
	document.getElementById("deleteContactResult").className = "successMessage";

	clearSelectedContact();

	setTimeout(function()
	{
		document.getElementById("deleteContactForm").style.display = "none";
		document.getElementById("contactCardDetails").style.display = "none";
		document.getElementById("emptyContactsMessage").style.display = "block";
		showDashboardMessage("Contact deleted.");
		loadMockContacts();
	}, 2500);
}
