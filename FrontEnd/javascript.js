// Recuperation des donnees sur l'API

async function recuperationDonnees() {
    let response = await fetch(`http://localhost:5678/api/works/`)
    let data = await response.json()
    console.log(data)
}

recuperationDonnees()
affichageImages()


// Fonction Affichage des images et textes

async function affichageImages (){
    let response = await fetch(`http://localhost:5678/api/works/`)
    let data = await response.json()

    for(let i = 0 ; i < data.length ; i++){
        let gallery = document.querySelector(".gallery")
        let figure = document.createElement("figure")
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")

        img.src = data[i].imageUrl
        img.alt = data[i].title
        figcaption.innerText = data[i].title

        gallery.appendChild(figure)
        figure.appendChild(img)
        figure.appendChild(figcaption)
    }
}