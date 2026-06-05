/*
 * Shared API helper functions.
 * All frontend API calls go through apiRequest() so that error handling stays consistent.
 */

/**
 * Sends a JSON request to one of the PHP API endpoints.
 *
 * @param {string} endpoint - PHP endpoint filename without extension, such as "Login" or "Create".
 * @param {object} payload - JSON data to send to the API.
 * @param {string} method - HTTP method. Defaults to POST because the class APIs read php://input.
 * @returns {Promise<object>} Parsed JSON response from the server.
 */
async function apiRequest(endpoint, payload, method = "POST")
{
	const url = API_BASE_URL + "/" + endpoint + "." + API_EXTENSION;

	let response;

	try
	{
		response = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json; charset=UTF-8"
			},
			body: JSON.stringify(payload)
		});
	}
	catch(err)
	{
		throw new Error("Could not reach the server. Please check your connection.");
	}

	if( !response.ok )
	{
		throw new Error("The server returned an error. Please try again.");
	}

	try
	{
		return await response.json();
	}
	catch(err)
	{
		throw new Error("The server response was not valid JSON.");
	}
}
