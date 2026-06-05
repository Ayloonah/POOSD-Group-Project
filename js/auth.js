/*
 * Login and registration logic.
 *
 * Password hashing is intentionally NOT done in the frontend.
 * The frontend sends the password to Login.php, and PHP handles:
 * - password_hash() during registration
 * - password_verify() during login
 */

function setLoginMessage(message, isSuccess)
{
	const result = document.getElementById("loginResult");
	result.innerHTML = message;
	result.className = isSuccess ? "successMessage" : "errorMessage";
}

function setLoginButtonLoading(isLoading)
{
	const loginButton = document.getElementById("loginButton");

	if( isLoading )
	{
		loginButton.disabled = true;
		loginButton.innerHTML = "Logging in...";
	}
	else
	{
		loginButton.disabled = false;
		loginButton.innerHTML = "Login";
	}
}

async function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	const login = document.getElementById("loginName").value.trim();
	const password = document.getElementById("loginPassword").value;

	setLoginMessage("", false);

	if( login == "" || password == "" )
	{
		setLoginMessage("Please enter your username and password.", false);
		return;
	}

	const payload = {
		action: "login",
		login: login,
		password: password
	};

	setLoginButtonLoading(true);

	try
	{
		const response = await apiRequest("Login", payload);

		if( response.id == undefined || response.error == undefined )
		{
			setLoginMessage("Login response was missing required data. Please try again.", false);
			return;
		}

		userId = response.id;

		if( userId < 1 )
		{
			setLoginMessage(response.error, false);
			return;
		}

		firstName = response.firstName;
		lastName = response.lastName;

		saveCookie();
		window.location.href = "contact.html";
	}
	catch(err)
	{
		setLoginMessage(err.message, false);
	}
	finally
	{
		setLoginButtonLoading(false);
	}
}

function setRegisterMessage(message, isSuccess)
{
	const result = document.getElementById("registerResult");
	result.innerHTML = message;
	result.className = isSuccess ? "successMessage" : "errorMessage";
}

function setRegisterButtonLoading(isLoading)
{
	const registerButton = document.getElementById("registerButton");

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

async function doRegister()
{
	const firstNameInput = document.getElementById("registerFirstName").value.trim();
	const lastNameInput = document.getElementById("registerLastName").value.trim();
	const login = document.getElementById("registerLogin").value.trim();
	const password = document.getElementById("registerPassword").value;
	const confirmPassword = document.getElementById("registerConfirmPassword").value;

	setRegisterMessage("", false);

	if( firstNameInput == "" || lastNameInput == "" || login == "" || password == "" || confirmPassword == "" )
	{
		setRegisterMessage("Please fill in all fields.", false);
		return;
	}

	if( !checkRegisterPasswords() )
	{
		setRegisterMessage("Passwords do not match.", false);
		return;
	}

	const payload = {
		action: "register",
		firstName: firstNameInput,
		lastName: lastNameInput,
		login: login,
		password: password
	};

	setRegisterButtonLoading(true);

	try
	{
		const response = await apiRequest("Login", payload);

		if( response.error == undefined )
		{
			setRegisterMessage("Registration response was missing required data. Please try again.", false);
			return;
		}

		if( response.error != "" )
		{
			setRegisterMessage(response.error, false);
			return;
		}

		setRegisterMessage("Account created successfully. Redirecting to login...", true);

		setTimeout(function()
		{
			window.location.href = "index.html";
		}, 1500);
	}
	catch(err)
	{
		setRegisterMessage(err.message, false);
	}
	finally
	{
		setRegisterButtonLoading(false);
	}
}

function checkRegisterPasswords()
{
	const password = document.getElementById("registerPassword").value;
	const confirmPassword = document.getElementById("registerConfirmPassword").value;

	if( password == "" && confirmPassword == "" )
	{
		setRegisterMessage("", false);
		return false;
	}

	if( confirmPassword == "" )
	{
		setRegisterMessage("Confirm your password.", false);
		return false;
	}

	if( password == confirmPassword )
	{
		setRegisterMessage("Passwords match.", true);
		return true;
	}

	setRegisterMessage("Passwords do not match.", false);
	return false;
}