/* To be modified, this is the sample js code */


const urlBase = 'http://COP4331-5.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

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
		window.location.href = "index.html";
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

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
