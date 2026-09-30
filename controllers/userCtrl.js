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


async function login(){
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value

    let user = {
        email,
        password
    }

    const response = await fetch(`http://localhost:3000/users/login`, {
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    let res = await response.json()
    if(response.status !=200){
        showMessage('danger', 'ERROR', res.error );
    } else{
        showMessage('success', 'OK', res.message);
        storeUser(res.loggedUser);
        loginCheck();
    }
}

function logout(){
    clearUser();
    loginCheck();
}

function storeUser(user) {
    sessionStorage.setItem('SCU', JSON.stringify(user));
}

function loadUser() {
    let user = JSON.parse(sessionStorage.getItem('SCU'));
    return user;
}

function clearUser() {
    sessionStorage.removeItem('SCU');
}

function loginCheck() {
    if (user = loadUser()){ //két művelet egyben, 1: ellenőrizzük a loadUser-el a sessionstorage kulcsot, majd 2. a visszaadott értéket eltároljuk a user változóban
        if (user.role == 'admin'){
            //alert("belépve")
            setMenuItems('admin');
            navigate('admin/dashboard');
        }
        else if (user.role == 'user')
        {
            setMenuItems('user')
            //alert("user belépve")
            navigate('users/steps');
        }
        else
        {
            setMenuItems('')
            navigate('home')
        }
    }
    else{
        //alert("nincs belépve")
        setMenuItems('');
        navigate('users/login');
    }
}

function setMenuItems(param){
    let baseMenu = document.querySelector('#baseMenu');
    let userMenu = document.querySelector('#userMenu');
    let adminMenu = document.querySelector('#adminMenu');
    switch(param){
        case 'admin' : {
            baseMenu.classList.add('hide');
            userMenu.classList.add('hide');
            adminMenu.classList.remove('hide');
            break;
        }
        case 'user' : {
            baseMenu.classList.add('hide');
            adminMenu.classList.add('hide');
            userMenu.classList.remove('hide');
            break;
        }
        case '' : {
            baseMenu.classList.remove('hide');
            userMenu.classList.add('hide');
            adminMenu.classList.add('hide');
            break;
        }
    }
}

async function updateProfile(){
   let name = document.querySelector('#name');
   let email = document.querySelector('#email');

   let loggedUser = loadUser();
   let data = {
       username: name.value,
       email: email.value,
       luid: loadUser().ID
   };
   const response = await fetch(`http://localhost:3000/users/${loggedUser.ID}`, {
       method: 'POST',
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify({data})
   });
   let res = await response.json();
   if(response.status != 200){
       showMessage('danger', 'ERROR', res.error);
   } else {
       showMessage('success', 'OK', res.message);
       let user ={
        ID: loggedUser.ID,
        name: name.value,
        email: email.value,
        role: loggedUser.role
       }
       storeUser(user);
   }
}

async function updatePassword(){
    let oldpass = document.querySelector('#oldpass');
    let newpass = document.querySelector('#newpass');
    let confirm = document.querySelector('#confirm');

    let data = {
        oldpass: oldpass.value,
        newpass: newpass.value,
        confirm: confirm.value
    }

    let uid = loadUser() ? loadUser().id : 0;
    const response = await fetch(`http://localhost:3000/users/${uid}/passmod`, {
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data})
    });

    let res = await response.json();

    if(response.status !=200){
        showMessage('danger', 'ERROR', res.error );
    } else{
        showMessage('success', 'OK', res.message);
        oldpass.value = '';
        newpass.value = '';
        confirm.value = '';
    }
}

async function getUserData() {
    let user = loadUser();
    document.querySelector('#name').value = user.name;
    document.querySelector('#email').value = user.email;
}