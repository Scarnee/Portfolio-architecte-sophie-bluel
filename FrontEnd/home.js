

/**
 * Recuperation des donnees sur l'API
 */
async function getData() {  
    try{
        let response = await fetch(`http://localhost:5678/api/works/`)
        if (!response.ok){
            throw new Error (`Une erreur ${response.status}`)
        }
        let data = await response.json()
        console.log(data)
        showImages(data)
        


        // Mise en tableau Categories Id et Noms
        let categId=[]
        let categName=[]
        for (const elem of data){
            if(!categId.includes(elem.category.id)){
                categId.push(elem.category.id)
                categName.push(elem.category.name) 
            }     
        }
        console.log(categId)
        console.log(categName)
        showButtons(categId, categName)
        filterCategory(data)
        checkUser()
        logoutUser()
        openModal()
        showImagesModal(data)
        
    }
    
    catch(error){
        alert (error)

    }
    
}

/**
 * Fonction Affichage des images et textes
 * @param {Array} data 
 */

function showImages (data){
    for(const i of data){
        // Ajout sur page d'acceuil //
        let gallery = document.querySelector(".gallery")
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")
        
        
        img.src = i.imageUrl
        img.alt = i.title
        figcaption.innerText = i.title
        figure.setAttribute('class',i.category.name)
        figure.setAttribute('id',i.id)

        gallery.appendChild(figure)
        figure.appendChild(img)
        figure.appendChild(figcaption)




    }
}


/**
 * Ajout des boutons via JS
 * @param {Array} (dataId, dataName)
 */
function showButtons (dataId, dataName){
    let portfolio = document.getElementById("portfolio")
    let filters = document.createElement("div")
    filters.setAttribute("class","filters")
    filters.setAttribute("id","filters")
    portfolio.insertBefore(filters,portfolio.childNodes[3])
    let btnTous = document.createElement("button")
    btnTous.innerText = "Tous"
    btnTous.id = 0
    filters.appendChild(btnTous)
    for(let i = 0 ; i < dataId.length ; i++){
        let button = document.createElement("button")
        filters.appendChild(button)   
        button.id = dataId[i]
        button.innerText = dataName[i]
        console.log(button.id)         
    }
}


/**
 * Fonction filtres
 */
function filterCategory(data){
    document.querySelectorAll(".filters button").forEach(button => {   
        button.addEventListener('click', () => {
            let btnId = button.id
            console.log(btnId)
            if (Number(btnId) != 0){
               const filteredFigures = data.filter(function(data) {
                return data.categoryId === Number(btnId)
        })
            console.log(filteredFigures)
            document.querySelector(".gallery").innerHTML=''
            showImages(filteredFigures)
        } else {
            document.querySelector(".gallery").innerHTML=''
            showImages(data)
        }
      }
              
    ) 
})
}




document.addEventListener('DOMContentLoaded',()=>{
    getData()
})


/**
 * Fonction pour check si l'utilisateur est enregistrer et faire apparaitre differents boutons
 */
function checkUser(){
        const editMode = document.getElementById('editMode')
        const filters = document.getElementById('filters')
        const userId = window.localStorage.getItem('userId')
        const loginLink = document.getElementById('loginLink')
        const btnModification = document.getElementById('btnModification')
        console.log(userId)
        if(userId == 1){
            btnModification.classList.remove('hidden')
            filters.classList.add('hidden')
            editMode.classList.remove('hidden')
            loginLink.innerHTML = '<button id="btnLogout">logout</button>'
            
        } else {
            console.log('non')
        }
    }
/**
 * Fonction pour logout l'utilisateur
 */
async function logoutUser (){
    const userId = window.localStorage.getItem('userId')
    const logoutBtn = document.getElementById('loginLink')
    logoutBtn.addEventListener('click', () => {
        if(userId == 1){
        window.localStorage.removeItem('userId')
        window.localStorage.removeItem('token')
        window.location.replace('index.html')
    }
    })
    
}



/**
 * Fonction ouverture et fermeture de la modale
 */

async function openModal (){
    const userId = window.localStorage.getItem('userId')
    const btnModif = document.getElementById('btnModification')
    const modalPopup = document.getElementById('modalBackground')
    const btnFermeture = document.getElementById('btnFermeture')
    btnModif.addEventListener('click', () => {
        if(userId == 1){
            console.log('ok')
            modalPopup.classList.remove('hidden')
            deleteProjectStart()
            addPhoto()
            retourModal()
        }
    })
    btnFermeture.addEventListener('click', () => {
            modalPopup.classList.add('hidden')
    })
}

/**
 * Fonction affichage des images de la modale
 * @param {Array} data 
 */
async function showImagesModal (data){
    for(const i of data){

        let modalGallery = document.getElementById('modalGallery')
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let trashbin = document.createElement("i")
        
        trashbin.setAttribute('class','fa-solid fa-trash-can')
        trashbin.setAttribute('id',i.id)
        img.src = i.imageUrl
        img.alt = i.title
        figure.setAttribute('class',i.category.id)

        modalGallery.appendChild(figure)
        figure.appendChild(trashbin)
        figure.appendChild(img)

} 
} 

/**
 * Fonction Suppression de projet
 */

function deleteProjectStart(){
    const trashbins = document.querySelectorAll('.modalGallery i')
    trashbins.forEach(elem => {
        elem.addEventListener('click', () =>{
            const id = elem.id
            console.log(id)
            deleteProjectEnd(id)
        })
    })
   
}

async function deleteProjectEnd(id){
    try {   const figureId = document.getElementById(id)
            const token = window.localStorage.getItem('token')
            const response = await fetch (`http://localhost:5678/api/works/${id}`,{
            method:'DELETE',
            headers:{
                'Accept': '*/*',
                'Authorization': 'Bearer ' + token,
                "Content-Type":"application/json"
            }
        })
        if (response.status !== 200){
            throw new Error(response.status)
        } else {
            console.log(response.status)
            figureId.classList.add('hidden')

        }
        
    }
    catch(error){
        alert(error)
    }
   
}

function addPhoto (){
    const btnAddPhoto = document.getElementById('ajoutPhoto')
    const modalContent = document.getElementById('modalContent')
    const modalAjoutPhoto = document.getElementById('modalAjoutPhoto')

    btnAddPhoto.addEventListener('click', () => {
        modalContent.classList.add('hidden')
        modalAjoutPhoto.classList.remove('hidden')

    })
}

function retourModal(){
    const btnRetour = document.getElementById('btnRetour')
    const modalContent = document.getElementById('modalContent')
    const modalAjoutPhoto = document.getElementById('modalAjoutPhoto')

    btnRetour.addEventListener('click', () => {
        modalContent.classList.remove('hidden')
        modalAjoutPhoto.classList.add('hidden')

    })
}