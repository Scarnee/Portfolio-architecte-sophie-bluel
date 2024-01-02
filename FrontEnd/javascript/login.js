

function register(){
    let form = document.getElementById('loginForm')
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        email = document.getElementById("email").value
        pwd = document.getElementById('pwd').value
        if (validateEmail(email) == true && validatePassword(pwd) == true ){
            postResults(email, pwd)
        } else {
        }
    })
}

function validateEmail(email){
    const emailRegex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+")
    if (emailRegex.test(email)){
        return true
    }else{
        return false
    }
}

function validatePassword(pwd){
    if (pwd.length > 2){
        return true
    } else {
        return false
    }
    
}

async function postResults (email, pwd){
    try{
       const response = await fetch('http://localhost:5678/api/users/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email: email,
            password: pwd
          })
    })
    if(!response.ok){
        throw new Error ('Une erreur est survenu')
    }
    if (response.status !== 200){
        const wrongIds = document.getElementById('wrongIds')
        wrongIds.classList.remove('hidden')
    } else {
        response.json().then(data => {
            window.localStorage.setItem("token", data.token)
            window.localStorage.setItem("userId", data.userId)
            window.location.replace("index.html")
             
        })        
    } 
    }  
    catch (error){
        alert(error)
    }
}


    










document.addEventListener('DOMContentLoaded',()=>{
    register()
})