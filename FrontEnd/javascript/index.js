////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// RECUPERATION DE DONNEES DANS L'API / FONCTION PRINCIPALE /////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recuperation des donnees sur l'API
 */
async function getData() {
    try {
        let response = await fetch(`http://localhost:5678/api/works/`);
        if (!response.ok) {
            throw new Error(`Une erreur ${response.status}`);
        }
        let data = await response.json();
        showImages(data);

        // Mise en tableau Categories Id et Noms
        let categId = [];
        let categName = [];
        for (const elem of data) {
            if (!categId.includes(elem.category.id)) {
                categId.push(elem.category.id);
                categName.push(elem.category.name);
            }
        }
        showButtons(categId, categName);
        filterCategory(data);
        checkUser();
        getCategories();
        showImagesModal(data);
    } catch (error) {
        alert(error);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// CREATIONS DES BOUTONS DE FILTRES + FILTRAGE /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Ajout des boutons via JS
 * @param {Array} (dataId, dataName)
 */
function showButtons(dataId, dataName) {
    let portfolio = document.getElementById("portfolio");
    let filters = document.createElement("div");
    filters.setAttribute("class", "filters");
    filters.setAttribute("id", "filters");
    portfolio.insertBefore(filters, portfolio.childNodes[3]);
    let btnTous = document.createElement("button");
    btnTous.innerText = "Tous";
    btnTous.id = 0;
    filters.appendChild(btnTous);
    for (let i = 0; i < dataId.length; i++) {
        let button = document.createElement("button");
        filters.appendChild(button);
        button.id = dataId[i];
        button.innerText = dataName[i];
    }
}

/**
 * Fonction filtres
 */

function filterCategory(data) {
    const figuresGallery = document.querySelectorAll(".gallery figure");
    console.log(figuresGallery);
    document.querySelectorAll(".filters button").forEach((button) => {
        button.addEventListener("click", () => {
            let btnId = button.id;
            for (const figure of figuresGallery) {
                figure.classList.add("hidden");
                // btnId = 0 correspond au bouton "Tous"//
                if (btnId != 0) {
                    if (figure.classList.contains(btnId)) {
                        figure.classList.remove("hidden");
                    } else {
                        figure.classList.add("hidden");
                    }
                } else {
                    figure.classList.remove("hidden");
                }
            }
        });
    });
}

/////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTIONS POUR ADMINS /////////////////////////
/////////////////////////////////////////////////////////////////////////

/**
 * Fonction pour check si l'utilisateur est enregistrer et faire apparaitre differents boutons
 */

function checkUser() {
    if (window.localStorage.getItem("userId")) {
        const editMode = document.getElementById("editMode");
        const filters = document.getElementById("filters");
        const loginLink = document.getElementById("loginLink");
        const btnModification = document.getElementById("btnModification");
        btnModification.classList.remove("hidden");
        filters.classList.add("hidden");
        editMode.classList.remove("hidden");
        loginLink.innerHTML = '<button id="btnLogout">logout</button>';
        logoutUser();
        openModal();
    }
}

/**
 * Fonction pour logout l'utilisateur
 */

function logoutUser() {
    const userId = window.localStorage.getItem("userId");
    const logoutBtn = document.getElementById("loginLink");
    logoutBtn.addEventListener("click", () => {
        if (userId == 1) {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            btnModification.classList.add("hidden");
            filters.classList.remove("hidden");
            editMode.classList.add("hidden");
            loginLink.innerHTML = '<a href="login.html">login</a>';
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////// OUVERTURE ET FERMETURE DE LA MODALE /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction ouverture et fermeture de la modale
 */

function openModal() {
    const userId = window.localStorage.getItem("userId");
    const btnModif = document.getElementById("btnModification");
    const modalPopup = document.getElementById("modalBackground");
    const btnFermeture1 = document.getElementById("btnFermeture1");
    const btnFermeture2 = document.getElementById("btnFermeture2");
    const modalContent = document.getElementById("modalContent");
    const modalAjoutPhoto = document.getElementById("modalAjoutPhoto");

    btnModif.addEventListener("click", () => {
        if (userId == 1) {
            modalPopup.classList.remove("hidden");
            addPhoto();
            retourModal();
            deleteListening();
        }
    });
    btnFermeture1.addEventListener("click", () => {
        modalPopup.classList.add("hidden");
    });
    btnFermeture2.addEventListener("click", () => {
        modalPopup.classList.add("hidden");
        modalContent.classList.remove("hidden");
        modalAjoutPhoto.classList.add("hidden");
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// AFFICHAGE DES IMAGES DANS LA GALERIE ET LA MODALE /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction Affichage des images et textes
 * @param {Array} data
 */

function showImages(data) {
    for (const i of data) {
        // Ajout sur page d'acceuil //
        let gallery = document.querySelector(".gallery");
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figcaption = document.createElement("figcaption");

        img.src = i.imageUrl;
        img.alt = i.title;
        figcaption.innerText = i.title;
        figure.setAttribute("class", i.category.id);
        figure.setAttribute("id", `gallery_${i.id}`);

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}

/**
 * Fonction affichage des images de la modale
 * @param {Array} data
 */

function showImagesModal(data) {
    for (const i of data) {
        let modalGallery = document.getElementById("modalGallery");
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let trashbin = document.createElement("i");

        trashbin.setAttribute("class", "fa-solid fa-trash-can");
        trashbin.setAttribute("id", i.id);
        figure.setAttribute("id", "figure_" + i.id);
        img.src = i.imageUrl;
        img.alt = i.title;
        figure.setAttribute("class", i.category.id);

        modalGallery.appendChild(figure);
        figure.appendChild(trashbin);
        figure.appendChild(img);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTIONS POUR SUPPRESSION DES PROJETS DANS LA MODALE /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction Ecoute Suppression Projet
 */

function deleteListening() {
    const trashbins = document.querySelectorAll(".modalGallery i");
    trashbins.forEach((elem) => {
        elem.addEventListener("click", () => {
            const id = elem.id;
            deleteProject(id);
        });
    });
}

/**
 * Fonction Suppression de projet
 * @param {Number} id
 */

async function deleteProject(id) {
    try {
        const figureId = document.getElementById("figure_" + id);
        const galleryId = document.getElementById("gallery_" + id);
        const token = window.localStorage.getItem("token");
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(response.status);
        } else {
            figureId.remove();
            galleryId.remove();
        }
    } catch (error) {
        alert(error);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTIONS D'AVANCE ET DE RETOUR DANS LA MODALE /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction Avance Modale
 */
function addPhoto() {
    const btnAddPhoto = document.getElementById("ajoutPhoto");
    const modalContent = document.getElementById("modalContent");
    const modalAjoutPhoto = document.getElementById("modalAjoutPhoto");

    btnAddPhoto.addEventListener("click", () => {
        modalContent.classList.add("hidden");
        modalAjoutPhoto.classList.remove("hidden");
        previewImage();
        inputListening();
    });
}

/**
 * Fonction Retour Modale
 */

function retourModal() {
    const btnRetour = document.getElementById("btnRetour");
    const modalContent = document.getElementById("modalContent");
    const modalAjoutPhoto = document.getElementById("modalAjoutPhoto");

    btnRetour.addEventListener("click", () => {
        modalContent.classList.remove("hidden");
        modalAjoutPhoto.classList.add("hidden");
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// CREATION DE LA LISTE DEROULANTE DE CHOIX DE CATEGORIES DANS LA MODALE /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recuperation des categories dans l'API
 */
async function getCategories() {
    try {
        let response = await fetch(`http://localhost:5678/api/categories/`);
        if (!response.ok) {
            throw new Error(`Une erreur ${response.status}`);
        } else {
            let categoriesData = await response.json();
            let categId = [];
            let categName = [];
            for (const elem of categoriesData) {
                if (!categId.includes(elem.id)) {
                    categId.push(elem.id);
                    categName.push(elem.name);
                }
            }
            selectListModal(categId, categName);
        }
    } catch (error) {
        alert(error);
    }
}

/**
 * Fonction creation Liste categorie dans modale
 * @param {Array} selectId
 * @param {Array} selectName
 */

function selectListModal(selectId, selectName) {
    const categoryList = document.getElementById("categoryList");

    for (let i = 0; i < selectId.length; i++) {
        const option = document.createElement("option");
        option.innerText = selectName[i];
        option.value = selectName[i];
        option.id = selectId[i];
        categoryList.appendChild(option);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// UPLOAD & PREVIEW IMAGE DANS LA MODALE + SUPPRESSION /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction Upload et Preview Image
 */

function previewImage() {
    const fileInput = document.getElementById("newImage");
    const previewImage = document.getElementById("previewImage");
    const btnAjoutPhoto = document.getElementById("btnAjoutPhoto");
    const previewImageConteneur = document.getElementById("previewImageConteneur");

    fileInput.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
            previewImage.src = URL.createObjectURL(event.target.files[0]);
            previewImage.style.display = "block";
            btnAjoutPhoto.classList.add("hidden");
            previewImageConteneur.classList.remove("hidden");
            previewImage.classList.add("imageLoaded");
            deletePreviewImage();
            validateProject();
        } else {
            previewImage.classList.remove("imageLoaded");
        }
    });
}

/**
 * Fonction Suppression Preview Image
 */

function deletePreviewImage() {
    const deleteImage = document.getElementById("btnSuppressionPreview");
    const previewImage = document.getElementById("previewImage");

    deleteImage.addEventListener("click", () => {
        previewImage.src = "#";
        btnAjoutPhoto.classList.remove("hidden");
        previewImageConteneur.classList.add("hidden");
        previewImage.classList.remove("imageLoaded");
        validateProject();
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// VALIDATION DU PROJET EN FONCTION DES CHAMPS /////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fonction Ecoute Input fields pour bouton validation
 */

function inputListening() {
    const inputFields = document.querySelectorAll("#formAjoutProjet input");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].addEventListener("input", () => {
            validateProject();
        });
    }
}

/**
 * Fonction all input fields OK pour Valider Projet
 */

function validateProject() {
    const validerProjet = document.getElementById("validerProjet");
    const title = document.getElementById("title").value;
    const category = document.getElementById("categoryList").value;
    const image = document.getElementById("previewImage");

    if (title.length > 0 && category.length > 0 && image.classList.contains("imageLoaded")) {
        validerProjet.disabled = false;
        validerProjet.classList.remove("disabled");
    } else {
        validerProjet.disabled = true;
        validerProjet.classList.add("disabled");
    }
}

//////////////////////////////////////////////////////////////////////////////
///////////////////////// AJOUT DU PROJET DANS L'API /////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Fonction ajout projet dans API
 */

const validerProjet = document.getElementById("validerProjet");
validerProjet.addEventListener("click", addProject);

async function addProject(event) {
    event.preventDefault();
    try {
        const title = document.getElementById("title").value;
        const select = document.getElementById("categoryList");
        const options = select.options;
        const categoryId = options[options.selectedIndex].id;
        const image = document.getElementById("newImage").files[0];

        const bodyContent = new FormData();

        bodyContent.append("image", image);
        bodyContent.append("title", title);
        bodyContent.append("category", categoryId);
        const token = window.localStorage.getItem("token");

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                accept: "application/json",
            },
            body: bodyContent,
        });

        if (!response.ok) {
            throw new Error();
        } else {
            //showImages(await response.json());
            window.location.replace("index.html");
        }
    } catch (error) {
        alert(error);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FONCTION D'ECOUTE DE DOM LOADED POUR INITIALISATION DE LA PAGE /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    getData();
});
