

function register(){
    let form = document.getElementById('loginForm')
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        email = document.getElementById("email").value
        pwd = document.getElementById('pwd').value
        if (email === '' || email === null){
            alert('Besoin dun email')
        }
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
        console.log('ko')
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
    let jsonEmail = JSON.stringify(email)
    let jsonPwd = JSON.stringify(pwd)
    await fetch('http://localhost:5678/api/users/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:{
            "email": jsonEmail,
            "password": jsonPwd
          }
    })
    console.log(body)
}










document.addEventListener('DOMContentLoaded',()=>{
    register()
})