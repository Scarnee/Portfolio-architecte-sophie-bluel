

function register(){
    let form = document.getElementById('loginForm')
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        email = document.getElementById("email").value
        pwd = document.getElementById('pwd').value
        if (validateEmail(email) == true && validatePassword(pwd) == true ){
            console.log('results sent')
            postResults(email, pwd)
        } else {
            console.log("pas d'envoi")
        }
    })
}

function validateEmail(email){
    const emailRegex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+")
    if (emailRegex.test(email)){
        console.log('ok')
        return true
    }else{
        console.log('Email non valide')
        return false
    }
}

function validatePassword(pwd){
    if (pwd.length > 2){
        console.log('ok')
        return true
    } else {
        console.log('ko')
        return false
    }
    
}

async function postResults (email, pwd){
    await fetch('http://localhost:5678/api/users/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email: email,
            password: pwd
          })
    }).then ((response) =>{
    if (response.status !== 200){
        console.log("Mauvais IDs")
        const wrongIds = document.getElementById('wrongIds')
        wrongIds.classList.remove('hidden')
    } else {
        response.json().then(data => {
            window.localStorage.setItem("token", data.token)
            window.localStorage.setItem("userId", data.userId)
            window.location.replace("index.html")
             
        })        
    }
})
}


    










document.addEventListener('DOMContentLoaded',()=>{
    register()
})