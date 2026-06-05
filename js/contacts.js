/*
 * Contact CRUD and search logic.
 */

function isValidEmail(email)
{
	const atSign = email.indexOf("@");
	const dot = email.lastIndexOf(".");

	if( atSign < 1 )
	{
		return false;
	}

	if( dot < atSign + 2 )
	{
		return false;
	}

	if( dot == email.length - 1 )
	{
		return false;
	}

	return true;
}

function isValidPhone(phone)
{
	if( phone.length != 10 )
	{
		return false;
	}

	for( let i = 0; i < phone.length; i++ )
	{
		if( phone[i] < "0" || phone[i] > "9" )
		{
			return false;
		}
	}

	return true;
}

async function loadContacts()
{
	document.getElementById("contactList").innerHTML = "";

	if( USE_MOCK_CONTACTS )
	{
		loadMockContacts();
		return;
	}

	if( userId < 1 )
	{
		showDashboardMessage("Log in to load your contacts.");
		return;
	}

	const payload = {
		userID: userId
	};

	try
	{
		const response = await apiRequest("Read", payload);

		if( response.results == undefined )
		{
			showDashboardMessage("Contacts response was missing results.");
			return;
		}

		showContacts(response.results);

		if( response.results.length == 1 )
		{
			showDashboardMessage("Showing 1 contact.");
		}
		else
		{
			showDashboardMessage("Showing " + response.results.length + " contacts.");
		}
	}
	catch(err)
	{
		showDashboardMessage(err.message);
	}
}

function searchContactsOnEnter(event)
{
	if( event.key == "Enter" )
	{
		searchContacts();
	}
}

async function searchContacts()
{
	const searchText = document.getElementById("contactSearchText").value.trim();

	if( searchText == "" )
	{
		loadContacts();
		return;
	}

	if( USE_MOCK_CONTACTS )
	{
		searchMockContacts(searchText);
		return;
	}

	if( userId < 1 )
	{
		showDashboardMessage("Log in to search contacts.");
		return;
	}

	const payload = {
		userID: userId,
		search: searchText
	};

	document.getElementById("searchContactButton").disabled = true;
	document.getElementById("clearSearchButton").disabled = true;
	showDashboardMessage("Searching...");

	try
	{
		const response = await apiRequest("Search", payload);

		if( response.results == undefined )
		{
			showDashboardMessage("Search response was missing results.");
			return;
		}

		showContacts(response.results);

		if( response.results.length == 1 )
		{
			showDashboardMessage("Found 1 contact for \"" + searchText + "\".");
		}
		else
		{
			showDashboardMessage("Found " + response.results.length + " contacts for \"" + searchText + "\".");
		}
	}
	catch(err)
	{
		showDashboardMessage(err.message);
	}
	finally
	{
		document.getElementById("searchContactButton").disabled = false;
		document.getElementById("clearSearchButton").disabled = false;
	}
}

function clearSearch()
{
	document.getElementById("contactSearchText").value = "";
	showDashboardMessage("");
	loadContacts();
}

async function createContact()
{
	const contactFirstName = document.getElementById("contactFirstName").value.trim();
	const contactLastName = document.getElementById("contactLastName").value.trim();
	const contactPhone = document.getElementById("contactPhone").value.trim();
	const contactEmail = document.getElementById("contactEmail").value.trim();

	document.getElementById("addContactResult").innerHTML = "";

	if( contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "" )
	{
		document.getElementById("addContactResult").innerHTML = "Please fill in all contact fields.";
		document.getElementById("addContactResult").className = "errorMessage";
		return;
	}

    if( !isValidPhone(contactPhone) )
    {
        document.getElementById("addContactResult").innerHTML = "Phone number must be 10 digits.";
        document.getElementById("addContactResult").className = "errorMessage";
        return;
    }

    if( !isValidEmail(contactEmail) )
    {
        document.getElementById("addContactResult").innerHTML = "Invalid e-mail address.";
        document.getElementById("addContactResult").className = "errorMessage";
        return;
    }

	if( USE_MOCK_CONTACTS )
	{
		createMockContact(contactFirstName, contactLastName, contactPhone, contactEmail);
		return;
	}

	if( userId < 1 )
	{
		document.getElementById("addContactResult").innerHTML = "You must be logged in to add contacts.";
		document.getElementById("addContactResult").className = "errorMessage";
		return;
	}

	const payload = {
		firstName: contactFirstName,
		lastName: contactLastName,
		phone: contactPhone,
		email: contactEmail,
		userID: userId
	};

	document.getElementById("createContactButton").disabled = true;
	document.getElementById("createContactButton").innerHTML = "Saving...";

	try
	{
		const response = await apiRequest("Create", payload);

		if( response.error == undefined )
		{
			document.getElementById("addContactResult").innerHTML = "Create response was missing required data.";
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		if( response.error != "" )
		{
			document.getElementById("addContactResult").innerHTML = response.error;
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		document.getElementById("addContactResult").innerHTML = "Contact added successfully.";
		document.getElementById("addContactResult").className = "successMessage";

		document.getElementById("contactFirstName").value = "";
		document.getElementById("contactLastName").value = "";
		document.getElementById("contactPhone").value = "";
		document.getElementById("contactEmail").value = "";

		loadContacts();
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
		document.getElementById("addContactResult").className = "errorMessage";
	}
	finally
	{
		document.getElementById("createContactButton").disabled = false;
		document.getElementById("createContactButton").innerHTML = "Save Contact";
	}
}

async function updateContact()
{
	const editFirstName = document.getElementById("editContactFirstName").value.trim();
	const editLastName = document.getElementById("editContactLastName").value.trim();
	const editPhone = document.getElementById("editContactPhone").value.trim();
	const editEmail = document.getElementById("editContactEmail").value.trim();

	document.getElementById("editContactResult").innerHTML = "";

	if( editFirstName == "" || editLastName == "" || editPhone == "" || editEmail == "" )
	{
		document.getElementById("editContactResult").innerHTML = "Please fill in all contact fields.";
		document.getElementById("editContactResult").className = "errorMessage";
		return;
	}

    if( !isValidPhone(editPhone) )
    {
        document.getElementById("editContactResult").innerHTML = "Phone number must be 10 digits.";
        document.getElementById("editContactResult").className = "errorMessage";
        return;
    }

    if( !isValidEmail(editEmail) )
    {
        document.getElementById("editContactResult").innerHTML = "Invalid e-mail address.";
        document.getElementById("editContactResult").className = "errorMessage";
        return;
    }

	if( selectedContactID < 1 )
	{
		document.getElementById("editContactResult").innerHTML = "No saved contact is selected.";
		document.getElementById("editContactResult").className = "errorMessage";
		return;
	}

	if( USE_MOCK_CONTACTS )
	{
		updateMockContact(editFirstName, editLastName, editPhone, editEmail);
		return;
	}

	const payload = {
		firstName: editFirstName,
		lastName: editLastName,
		phone: editPhone,
		email: editEmail,
		contactID: selectedContactID
	};

	document.getElementById("updateContactButton").disabled = true;
	document.getElementById("updateContactButton").innerHTML = "Updating...";

	try
	{
		const response = await apiRequest("Update", payload);

		if( response.error == undefined )
		{
			document.getElementById("editContactResult").innerHTML = "Update response was missing required data.";
			document.getElementById("editContactResult").className = "errorMessage";
			return;
		}

		if( response.error != "" )
		{
			document.getElementById("editContactResult").innerHTML = response.error;
			document.getElementById("editContactResult").className = "errorMessage";
			return;
		}

		selectedContactFirstName = editFirstName;
		selectedContactLastName = editLastName;
		selectedContactPhone = editPhone;
		selectedContactEmail = editEmail;

		if( selectedContactButton != null )
		{
			selectedContactButton.innerHTML = editFirstName + " " + editLastName;

			// Update the button click handler too. Otherwise it keeps old contact values.
			selectedContactButton.onclick = function()
			{
				selectContact(selectedContactID, editFirstName, editLastName, editPhone, editEmail);
			};
		}

		document.getElementById("editContactResult").innerHTML = "Contact updated successfully.";
		document.getElementById("editContactResult").className = "successMessage";

		setTimeout(function()
		{
			selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
		}, 2500);
	}
	catch(err)
	{
		document.getElementById("editContactResult").innerHTML = err.message;
		document.getElementById("editContactResult").className = "errorMessage";
	}
	finally
	{
		document.getElementById("updateContactButton").disabled = false;
		document.getElementById("updateContactButton").innerHTML = "Update Contact";
	}
}

async function deleteContact()
{
	document.getElementById("deleteContactResult").innerHTML = "";

	if( selectedContactID < 1 )
	{
		document.getElementById("deleteContactResult").innerHTML = "No saved contact is selected.";
		document.getElementById("deleteContactResult").className = "errorMessage";
		return;
	}

	if( USE_MOCK_CONTACTS )
	{
		deleteMockContact();
		return;
	}

	const payload = {
		contactID: selectedContactID
	};

	document.getElementById("confirmDeleteContactButton").disabled = true;
	document.getElementById("confirmDeleteContactButton").innerHTML = "Deleting...";

	try
	{
		const response = await apiRequest("Delete", payload);

		if( response.error == undefined )
		{
			document.getElementById("deleteContactResult").innerHTML = "Delete response was missing required data.";
			document.getElementById("deleteContactResult").className = "errorMessage";
			return;
		}

		if( response.error != "" )
		{
			document.getElementById("deleteContactResult").innerHTML = response.error;
			document.getElementById("deleteContactResult").className = "errorMessage";
			return;
		}

		document.getElementById("deleteContactResult").innerHTML = "Contact deleted successfully.";
		document.getElementById("deleteContactResult").className = "successMessage";

		clearSelectedContact();

		setTimeout(function()
		{
			document.getElementById("deleteContactForm").style.display = "none";
			document.getElementById("contactCardDetails").style.display = "none";
			document.getElementById("emptyContactsMessage").style.display = "block";
			showDashboardMessage("Contact deleted.");
			loadContacts();
		}, 2500);
	}
	catch(err)
	{
		document.getElementById("deleteContactResult").innerHTML = err.message;
		document.getElementById("deleteContactResult").className = "errorMessage";
	}
	finally
	{
		document.getElementById("confirmDeleteContactButton").disabled = false;
		document.getElementById("confirmDeleteContactButton").innerHTML = "Delete Contact";
	}
}

function clearSelectedContact()
{
	selectedContactID = 0;
	selectedContactFirstName = "";
	selectedContactLastName = "";
	selectedContactPhone = "";
	selectedContactEmail = "";
	selectedContactButton = null;
}
