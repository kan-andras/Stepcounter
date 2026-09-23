async function registration(){
    
    let name = document.querySelector('#name').value
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    let confirm = document.querySelector('#confirm').value
    //meg kell szólítani a szervert

    let user = {
        name,
        email,
        password,
        confirm
    }
    const response = await fetch(`http://localhost:3000/users/register`, {
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    let res = await response.json()
    if(response.status !=201){
        showMessage('danger', 'ERROR', res.error );
    } else{
        showMessage('success', 'OK', res.message)
        navigate('users/login')
    }


}