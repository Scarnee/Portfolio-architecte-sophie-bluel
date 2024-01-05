////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTION POUR AUTHENTIFICATION / FONCTION PRINCIPALE /////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function register() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const pwd = document.getElementById("pwd").value;
        if (validateEmail(email) == true && validatePassword(pwd) == true) {
            postResults(email, pwd);
        } else {
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTIONS DE VALIDATION D'EMAIL ET MOT DE PASSE /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function validateEmail(email) {
    const emailRegex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    const wrongEmail = document.getElementById("wrongEmail");
    if (emailRegex.test(email)) {
        return true;
    } else {
        wrongEmail.classList.remove("hidden");
        return false;
    }
}

function validatePassword(pwd) {
    if (pwd.length > 0) {
        //Peut permettre des regles de verification preliminaire pour mot de passe afin d'activer bouton
        return true; // Dans notre cas, une regle d'un mot de passe > 0 ; possible de faire quelque chose plus complexe
    } else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTION D'ACTIVATION DU BOUTON DE CONNEXION /////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function activateSubmission() {
    const email = document.getElementById("email");
    const pwd = document.getElementById("pwd");
    const btnConnexion = document.getElementById("btnConnexion");
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach((field) => {
        field.addEventListener("input", () => {
            wrongIds.classList.add("hidden");
            wrongEmail.classList.add("hidden");
            if (email.value.length > 0 && pwd.value.length > 0) {
                btnConnexion.disabled = false;
                btnConnexion.classList.remove("disabled");
            } else {
                btnConnexion.disabled = true;
                btnConnexion.classList.add("disabled");
            }
        });
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTION POST D'EMAIL ET MOT DE PASSE POUR AUTHENTIFICATION /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function postResults(email, pwd) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: pwd,
            }),
        });
        if (response.status !== 401 && response.status !== 404 && response.status !== 200) {
            throw new Error("Une erreur est survenue");
        }
        if (response.status !== 200) {
            const wrongIds = document.getElementById("wrongIds");
            wrongIds.classList.remove("hidden");
        } else {
            response.json().then((data) => {
                window.localStorage.setItem("token", data.token);
                window.localStorage.setItem("userId", data.userId);
                window.location.replace("index.html");
            });
        }
    } catch (error) {
        alert(error);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTION D'ECOUTE DE DOM LOADED POUR INITIALISATION DE LA PAGE /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    register();
    activateSubmission();
});
