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
        for (let i of data){
            if(!categId.includes(i.category.id)){
                categId.push(i.category.id)
                categName.push(i.category.name) 
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
async function showImages (data){
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

        gallery.appendChild(figure)
        figure.appendChild(img)
        figure.appendChild(figcaption)




    }
}


/**
 * Ajout des boutons via JS
 * @param {Array} (dataId, dataName)
 */
async function showButtons (dataId, dataName){
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
async function filterCategory(data){
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
async function checkUser(){
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
    btnModif.addEventListener('click', () => {
        if(userId == 1){
            console.log('ok')
            modalPopup.classList.remove('hidden')
        }
    })
    modalPopup.addEventListener('click', (event) => {
        if (event.target === modalPopup){
            modalPopup.classList.add('hidden')
        }
    })
}

async function showImagesModal (data){
    for(const i of data){

        let modalGallery = document.getElementById('modalGallery')
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        
        img.src = i.imageUrl
        img.alt = i.title
        figure.setAttribute('class',i.category.name)

        modalGallery.appendChild(figure)
        figure.appendChild(img)

} 
} 