let contentbox = document.getElementById('content')
async function navigate(page){
    contentbox.innerHTML = await (await fetch(`views/${page}.html`)).text();
}

navigate('users/home');