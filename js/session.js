/*
 * Session helper functions.
 * This project uses simple browser cookies to remember the logged-in user.
 */

let userId = 0;
let firstName = "";
let lastName = "";

/*
 * Saves the logged-in user's basic information for 20 minutes.
 */
function saveCookie()
{
	const minutes = 20;
	const expirationDate = new Date();

	expirationDate.setTime(expirationDate.getTime() + (minutes * 60 * 1000));

	document.cookie = "firstName=" + encodeURIComponent(firstName) + ";expires=" + expirationDate.toUTCString() + ";path=/";
	document.cookie = "lastName=" + encodeURIComponent(lastName) + ";expires=" + expirationDate.toUTCString() + ";path=/";
	document.cookie = "userId=" + encodeURIComponent(userId) + ";expires=" + expirationDate.toUTCString() + ";path=/";
}

/*
 * Reads the saved user information from cookies.
 */
function readCookie()
{
	userId = -1;
	firstName = "";
	lastName = "";

	const cookies = document.cookie.split(";");

	for( let i = 0; i < cookies.length; i++ )
	{
		const cookie = cookies[i].trim();
		const parts = cookie.split("=");

		if( parts.length < 2 )
		{
			continue;
		}

		const name = parts[0];
		const value = decodeURIComponent(parts.slice(1).join("="));

		if( name == "firstName" )
		{
			firstName = value;
		}
		else if( name == "lastName" )
		{
			lastName = value;
		}
		else if( name == "userId" )
		{
			userId = parseInt(value);
		}
	}

	if( userId < 1 )
	{
		window.location.href = "index.html";
		return;
	}

	const userNameElement = document.getElementById("userName");

	if( userNameElement != null )
	{
		userNameElement.innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

/*
 * Clears the saved user information and returns to the login page.
 */
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

	window.location.href = "index.html";
}
