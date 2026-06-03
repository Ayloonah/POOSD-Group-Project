/* To be modified, this is the sample js code */

// This function is for testing purposes, it loads fake contacts without using the API. It can be used to test the dashboard 
// UI before the API is implemented.
//-----------------------------------------------------------------------------------------------------------------------------
let USE_MOCK_CONTACTS = true; // Set to false to load real contacts from the API instead of mock contacts for testing purposes.
//-----------------------------------------------------------------------------------------------------------------------------

const urlBase = 'http://www.coppoosd.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// These variables remember which contact the user clicked on.
let selectedContactID = 0;
let selectedContactFirstName = "";
let selectedContactLastName = "";
let selectedContactPhone = "";
let selectedContactEmail = "";
let selectedContactButton = null;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value.trim();
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	if( login == "" || password == "" )
	{
		document.getElementById("loginResult").innerHTML = "Please enter your username and password.";
		document.getElementById("loginResult").className = "errorMessage";
		return;
	}

	let tmp = {action:"login",login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 10000;
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	document.getElementById("loginButton").disabled = true;
	document.getElementById("loginButton").innerHTML = "Logging in...";

	xhr.onreadystatechange = function() 
	{
		if( this.readyState != 4 )
		{
			return;
		}

		document.getElementById("loginButton").disabled = false;
		document.getElementById("loginButton").innerHTML = "Login";

		if( this.status != 200 )
		{
			document.getElementById("loginResult").innerHTML = "The server returned an error. Please try again.";
			document.getElementById("loginResult").className = "errorMessage";
			return;
		}

		let jsonObject;

		try
		{
			jsonObject = JSON.parse( xhr.responseText );
		}
		catch(err)
		{
			document.getElementById("loginResult").innerHTML = "The server response was not valid. Please try again.";
			document.getElementById("loginResult").className = "errorMessage";
			return;
		}

		if( jsonObject.id == undefined || jsonObject.error == undefined )
		{
			document.getElementById("loginResult").innerHTML = "Login response was missing required data. Please try again.";
			document.getElementById("loginResult").className = "errorMessage";
			return;
		}

		userId = jsonObject.id;

		if( userId < 1 )
		{		
			document.getElementById("loginResult").innerHTML = jsonObject.error;
			document.getElementById("loginResult").className = "errorMessage";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.href = "contact.html";
	};

	xhr.onerror = function()
	{
		document.getElementById("loginButton").disabled = false;
		document.getElementById("loginButton").innerHTML = "Login";
		document.getElementById("loginResult").innerHTML = "Could not reach the server. Please check your connection.";
		document.getElementById("loginResult").className = "errorMessage";
	};

	xhr.ontimeout = function()
	{
		document.getElementById("loginButton").disabled = false;
		document.getElementById("loginButton").innerHTML = "Login";
		document.getElementById("loginResult").innerHTML = "The server is taking too long to respond. Please try again.";
		document.getElementById("loginResult").className = "errorMessage";
	};

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginButton").disabled = false;
		document.getElementById("loginButton").innerHTML = "Login";
		document.getElementById("loginResult").innerHTML = err.message;
		document.getElementById("loginResult").className = "errorMessage";
	}

}

function setRegisterMessage(message, isSuccess)
{
	let result = document.getElementById("registerResult");
	result.innerHTML = message;

	if( isSuccess )
	{
		result.className = "successMessage";
	}
	else
	{
		result.className = "errorMessage";
	}
}

function setRegisterButtonLoading(isLoading)
{
	let registerButton = document.getElementById("registerButton");

	if( isLoading )
	{
		registerButton.disabled = true;
		registerButton.innerHTML = "Creating...";
	}
	else
	{
		registerButton.disabled = false;
		registerButton.innerHTML = "Create Account";
	}
}

function doRegister()
{
	let firstName = document.getElementById("registerFirstName").value.trim();
	let lastName = document.getElementById("registerLastName").value.trim();
	let login = document.getElementById("registerLogin").value.trim();
	let password = document.getElementById("registerPassword").value;
	let confirmPassword = document.getElementById("registerConfirmPassword").value;

	setRegisterMessage("", false);

	if( firstName == "" || lastName == "" || login == "" || password == "" || confirmPassword == "" )
	{
		setRegisterMessage("Please fill in all fields.", false);
		return;
	}

	if( password != confirmPassword )
	{
		setRegisterMessage("Passwords do not match.", false);
		return;
	}

	let tmp = {action:"register",firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	setRegisterButtonLoading(true);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 10000;
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if( this.readyState != 4 )
		{
			return;
		}

		setRegisterButtonLoading(false);

		if( this.status != 200 )
		{
			setRegisterMessage("The server returned an error. Please try again.", false);
			return;
		}

		let jsonObject;

		try
		{
			jsonObject = JSON.parse( xhr.responseText );
		}
		catch(err)
		{
			setRegisterMessage("The server response was not valid. Please try again.", false);
			return;
		}

		if( jsonObject.error == undefined )
		{
			setRegisterMessage("Registration response was missing required data. Please try again.", false);
			return;
		}

		if( jsonObject.error != "" )
		{
			setRegisterMessage(jsonObject.error, false);
			return;
		}

		setRegisterMessage("Account created successfully. Redirecting to login...", true);
		setTimeout(function()
		{
			window.location.href = "index.html";
		}, 1500);
	};

	xhr.onerror = function()
	{
		setRegisterButtonLoading(false);
		setRegisterMessage("Could not reach the server. Please check your connection.", false);
	};

	xhr.ontimeout = function()
	{
		setRegisterButtonLoading(false);
		setRegisterMessage("The server is taking too long to respond. Please try again.", false);
	};

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		setRegisterButtonLoading(false);
		setRegisterMessage(err.message, false);
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		//window.location.href = "index.html"; // READ: Commented out for testing purposes, uncomment for production
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showEmptyContacts()
{
	document.getElementById("emptyContactsMessage").style.display = "block";
	document.getElementById("addContactForm").style.display = "none";
	document.getElementById("editContactForm").style.display = "none";
	document.getElementById("contactCardDetails").style.display = "none";
	document.getElementById("contactCardDetails").innerHTML = "";
	document.getElementById("contactList").innerHTML = "";
	document.getElementById("contactSearchResult").innerHTML = "";
}

function showDashboardMessage(message)
{
	document.getElementById("contactSearchResult").innerHTML = message;
}

/* Function that works in tandem with search.php to search for contacts by name, phone, or email and display the results on the dashboard. 
   This function is called whenever the user types in the search box or clicks the search button. */
function searchContacts()
{
	let searchText = document.getElementById("contactSearchText").value.trim();
	document.getElementById("contactSearchResult").innerHTML = "";
	
	if (searchText == "")
	{
		showDashboardMessage("Please enter a name, phone, or email to search.");
		return;
	}


	// THIS SECTION IS JUST FOR TESTING PURPOSES, USES MOCK CONTACTS INSTEAD OF MAKING AN API CALL.
	//---------------------------------------------------------------------------------------------
	if (USE_MOCK_CONTACTS)
	{
		let filteredContacts = mockContacts.filter(contact =>
			contact.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
			contact.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
			contact.phone.includes(searchText) ||
			contact.email.toLowerCase().includes(searchText.toLowerCase())
		);
		renderContactsWithDividers(filteredContacts);
		showDashboardMessage("Showing results for '" + searchText + "'.");
		return;
	}

	{
		searchMockContacts(searchText);
		return;
	}
	//---------------------------------------------------------------------------------------------


	let tmp = {search: searchText, userID: userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 10000;
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.onreadystatechange = function() 
		{
			if( this.readyState == 4 &&this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Results for '" + searchText + "':";

				let jsonObject = JSON.parse( xhr.responseText );

				for (let i = 0; i < jsonObject.results.length; i++)
				{
						searchText += jsonObject.results[i].firstName + " " + jsonObject.results[i].lastName + " - " + jsonObject.results[i].phone + " - " + jsonObject.results[i].email;
						
						if (i < jsonObject.results.length - 1)
						{
							searchText += "<br /> \r\n";
						}
					}
					document.getElementById("contactSearchResult").innerHTML = searchText;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = "An error occurred while searching. Please try again.";
	}

	showDashboardMessage("Search API will show matching contacts here.");
}

function showAddContactMessage()
{
	document.getElementById("emptyContactsMessage").style.display = "none";
	document.getElementById("contactCardDetails").style.display = "none";
	document.getElementById("editContactForm").style.display = "none";
	document.getElementById("addContactForm").style.display = "block";
	document.getElementById("addContactResult").innerHTML = "";
	showDashboardMessage("Fill out the form to add a new contact.");
}

function cancelAddContact()
{
	document.getElementById("contactFirstName").value = "";
	document.getElementById("contactLastName").value = "";
	document.getElementById("contactPhone").value = "";
	document.getElementById("contactEmail").value = "";
	document.getElementById("addContactResult").innerHTML = "";
	document.getElementById("addContactForm").style.display = "none";
	document.getElementById("editContactForm").style.display = "none";
	document.getElementById("contactCardDetails").style.display = "none";
	document.getElementById("emptyContactsMessage").style.display = "block";
	showDashboardMessage("");
}

function addContactToList(firstName, lastName, phone, email, contactID)
{
	let contactList = document.getElementById("contactList");
	let newContact = document.createElement("button");
	let fullName = firstName + " " + lastName;

	if( contactID == undefined )
	{
		contactID = 0;
	}

	newContact.type = "button";
	newContact.className = "contactListButton";
	newContact.innerHTML = fullName;

	newContact.onclick = function()
	{
		selectedContactButton = newContact;
		selectContact(contactID, firstName, lastName, phone, email);
	};

	contactList.appendChild(newContact);
}

function selectContact(contactID, firstName, lastName, phone, email)
{
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
	contactDetails += '<button type="button" id="deleteContactButton" onclick="showDeleteContactMessage();">Delete Contact</button>';

	document.getElementById("emptyContactsMessage").style.display = "none";
	document.getElementById("addContactForm").style.display = "none";
	document.getElementById("editContactForm").style.display = "none";
	document.getElementById("contactCardDetails").innerHTML = contactDetails;
	document.getElementById("contactCardDetails").style.display = "block";

	showDashboardMessage("");
}

function createContact()
{
	let contactFirstName = document.getElementById("contactFirstName").value.trim();
	let contactLastName = document.getElementById("contactLastName").value.trim();
	let contactPhone = document.getElementById("contactPhone").value.trim();
	let contactEmail = document.getElementById("contactEmail").value.trim();

	document.getElementById("addContactResult").innerHTML = "";

	if( contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "" )
	{
		document.getElementById("addContactResult").innerHTML = "Please fill in all contact fields.";
		document.getElementById("addContactResult").className = "errorMessage";
		return;
	}

	if( userId < 1 )
	{
		document.getElementById("addContactResult").innerHTML = "You must be logged in to add contacts.";
		document.getElementById("addContactResult").className = "errorMessage";
		return;
	}

	let tmp = {
		firstName: contactFirstName,
		lastName: contactLastName,
		phone: contactPhone,
		email: contactEmail,
		userID: userId
	};

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Create.' + extension;

	document.getElementById("createContactButton").disabled = true;
	document.getElementById("createContactButton").innerHTML = "Saving...";

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 10000;
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if( this.readyState != 4 )
		{
			return;
		}

		document.getElementById("createContactButton").disabled = false;
		document.getElementById("createContactButton").innerHTML = "Save Contact";

		if( this.status != 200 )
		{
			document.getElementById("addContactResult").innerHTML = "The server returned an error. Please try again.";
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		let jsonObject;

		try
		{
			jsonObject = JSON.parse( xhr.responseText );
		}
		catch(err)
		{
			document.getElementById("addContactResult").innerHTML = "The server response was not valid. Please try again.";
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		if( jsonObject.error == undefined )
		{
			document.getElementById("addContactResult").innerHTML = "Create response was missing required data.";
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		if( jsonObject.error != "" )
		{
			document.getElementById("addContactResult").innerHTML = jsonObject.error;
			document.getElementById("addContactResult").className = "errorMessage";
			return;
		}

		document.getElementById("addContactResult").innerHTML = "Contact added successfully.";
		document.getElementById("addContactResult").className = "successMessage";
		addContactToList(contactFirstName, contactLastName, contactPhone, contactEmail, 0);

		document.getElementById("contactFirstName").value = "";
		document.getElementById("contactLastName").value = "";
		document.getElementById("contactPhone").value = "";
		document.getElementById("contactEmail").value = "";
	};

	xhr.onerror = function()
	{
		document.getElementById("createContactButton").disabled = false;
		document.getElementById("createContactButton").innerHTML = "Save Contact";
		document.getElementById("addContactResult").innerHTML = "Could not reach the server. Please check your connection.";
		document.getElementById("addContactResult").className = "errorMessage";
	};

	xhr.ontimeout = function()
	{
		document.getElementById("createContactButton").disabled = false;
		document.getElementById("createContactButton").innerHTML = "Save Contact";
		document.getElementById("addContactResult").innerHTML = "The server is taking too long to respond. Please try again.";
		document.getElementById("addContactResult").className = "errorMessage";
	};

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("createContactButton").disabled = false;
		document.getElementById("createContactButton").innerHTML = "Save Contact";
		document.getElementById("addContactResult").innerHTML = err.message;
		document.getElementById("addContactResult").className = "errorMessage";
	}
}

function showEditContactMessage()
{
	if( selectedContactFirstName == "" )
	{
		showDashboardMessage("Select a contact first, then edit contact details here.");
		return;
	}

	if( selectedContactID < 1 )
	{
		showDashboardMessage("This contact must be loaded from the server before it can be edited.");
		return;
	}

	document.getElementById("emptyContactsMessage").style.display = "none";
	document.getElementById("addContactForm").style.display = "none";
	document.getElementById("contactCardDetails").style.display = "none";
	document.getElementById("editContactForm").style.display = "block";

	document.getElementById("editContactFirstName").value = selectedContactFirstName;
	document.getElementById("editContactLastName").value = selectedContactLastName;
	document.getElementById("editContactPhone").value = selectedContactPhone;
	document.getElementById("editContactEmail").value = selectedContactEmail;
	document.getElementById("editContactResult").innerHTML = "";
	showDashboardMessage("Edit the contact and click Update Contact.");
}

function cancelEditContact()
{
	document.getElementById("editContactForm").style.display = "none";
	document.getElementById("editContactResult").innerHTML = "";

	if( selectedContactFirstName == "" )
	{
		document.getElementById("emptyContactsMessage").style.display = "block";
	}
	else
	{
		selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
	}
}

function updateContact()
{
	let editFirstName = document.getElementById("editContactFirstName").value.trim();
	let editLastName = document.getElementById("editContactLastName").value.trim();
	let editPhone = document.getElementById("editContactPhone").value.trim();
	let editEmail = document.getElementById("editContactEmail").value.trim();

	document.getElementById("editContactResult").innerHTML = "";

	if( editFirstName == "" || editLastName == "" || editPhone == "" || editEmail == "" )
	{
		document.getElementById("editContactResult").innerHTML = "Please fill in all contact fields.";
		document.getElementById("editContactResult").className = "errorMessage";
		return;
	}

	if( selectedContactID < 1 )
	{
		document.getElementById("editContactResult").innerHTML = "No saved contact is selected.";
		document.getElementById("editContactResult").className = "errorMessage";
		return;
	}

	let tmp = {
		firstName: editFirstName,
		lastName: editLastName,
		phone: editPhone,
		email: editEmail,
		contactID: selectedContactID
	};

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Update.' + extension;

	document.getElementById("updateContactButton").disabled = true;
	document.getElementById("updateContactButton").innerHTML = "Updating...";

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 10000;
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if( this.readyState != 4 )
		{
			return;
		}

		document.getElementById("updateContactButton").disabled = false;
		document.getElementById("updateContactButton").innerHTML = "Update Contact";

		if( this.status != 200 )
		{
			document.getElementById("editContactResult").innerHTML = "The server returned an error. Please try again.";
			document.getElementById("editContactResult").className = "errorMessage";
			return;
		}

		let jsonObject;

		try
		{
			jsonObject = JSON.parse( xhr.responseText );
		}
		catch(err)
		{
			document.getElementById("editContactResult").innerHTML = "The server response was not valid. Please try again.";
			document.getElementById("editContactResult").className = "errorMessage";
			return;
		}

		if( jsonObject.error == undefined )
		{
			document.getElementById("editContactResult").innerHTML = "Update response was missing required data.";
			document.getElementById("editContactResult").className = "errorMessage";
			return;
		}

		if( jsonObject.error != "" )
		{
			document.getElementById("editContactResult").innerHTML = jsonObject.error;
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
		}

		document.getElementById("editContactResult").innerHTML = "Contact updated successfully.";
		document.getElementById("editContactResult").className = "successMessage";

		setTimeout(function()
		{
			selectContact(selectedContactID, selectedContactFirstName, selectedContactLastName, selectedContactPhone, selectedContactEmail);
		}, 800);
	};

	xhr.onerror = function()
	{
		document.getElementById("updateContactButton").disabled = false;
		document.getElementById("updateContactButton").innerHTML = "Update Contact";
		document.getElementById("editContactResult").innerHTML = "Could not reach the server. Please check your connection.";
		document.getElementById("editContactResult").className = "errorMessage";
	};

	xhr.ontimeout = function()
	{
		document.getElementById("updateContactButton").disabled = false;
		document.getElementById("updateContactButton").innerHTML = "Update Contact";
		document.getElementById("editContactResult").innerHTML = "The server is taking too long to respond. Please try again.";
		document.getElementById("editContactResult").className = "errorMessage";
	};

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateContactButton").disabled = false;
		document.getElementById("updateContactButton").innerHTML = "Update Contact";
		document.getElementById("editContactResult").innerHTML = err.message;
		document.getElementById("editContactResult").className = "errorMessage";
	}
}

function showDeleteContactMessage()
{
	showDashboardMessage("Select a contact first, then confirm delete here.");
}

/* Creates dividers between contact groups (CURRENTLY ORDERED BY LAST NAME) */
function renderContactsWithDividers(contacts)
{
    let contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    // Sort first
    contacts.sort((a, b) => {
        return (a.lastName + a.firstName)
            .toLowerCase()
            .localeCompare((b.lastName + b.firstName).toLowerCase());
    });

    let currentLetter = "";

    for (let c of contacts)
    {
        let fullName = (c.lastName + c.firstName);
        let firstLetter = c.lastName.charAt(0).toUpperCase();

        // Insert divider when letter changes
        if (firstLetter !== currentLetter)
        {
            currentLetter = firstLetter;

            let divider = document.createElement("div");
            divider.className = "contactDivider";
            divider.innerText = currentLetter;

            contactList.appendChild(divider);
        }

        addContactToList(
            c.firstName,
            c.lastName,
            c.phone,
            c.email,
            c.id
        );
    }
}

// This function is for testing purposes, it loads fake contacts without using the API. It can be used to test the dashboard 
// UI before the API is implemented.
//--------------------------------------------------------------------------------------------------------------------

let mockContacts = [{ id: 1, firstName: "John", lastName: "Doe", phone: "111-111-1111", email: "john@test.com" },
        { id: 2, firstName: "Jane", lastName: "Smith", phone: "222-222-2222", email: "jane@test.com" },
        { id: 3, firstName: "Mike", lastName: "Brown", phone: "333-333-3333", email: "mike@test.com" },
		{ id: 4, firstName: "Ben", lastName: "Affleck", phone: "444-444-4444", email: "benrunsonduncan@test.com" },
		{ id: 5, firstName: "Matt", lastName: "Damon", phone: "555-555-5555", email: "mattheartsteacher@test.com" },
		{ id: 6, firstName: "Carol", lastName: "Shelby", phone: "666-666-6666", email: "sevenlitersornuthin@test.com" },
		{ id: 7, firstName: "Ken", lastName: "Miles", phone: "777-777-7777", email: "learntodrivepillock@test.com" },
		{ id: 8, firstName: "Christian", lastName: "Bale", phone: "888-888-8888", email: "bestbatman@test.com" },
		{ id: 9, firstName: "Ronald", lastName: "MacDonald", phone: "999-999-9999", email: "burgersaregoodforyou@test.com"},
		{ id: 10, firstName: "SpongeBob", lastName: "SquarePants", phone: "123-456-7890", email: "spongebob@test.com" },
		{ id: 11, firstName: "Chief", lastName: "Keef", phone: "300-300-3000", email: "sosabackfromthedead@test.com" }
	];

function loadMockContacts()
{
	renderContactsWithDividers(mockContacts);
}
//--------------------------------------------------------------------------------------------------------------------
