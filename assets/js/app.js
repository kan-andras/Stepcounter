let contentbox = document.getElementById('content')

let lightModeBtn = document.querySelector('#lightModeBtn');
let darkModeBtn = document.querySelector('#darkModeBtn');

let theme = 'light';

async function navigate(page){
    contentbox.innerHTML = await (await fetch(`views/${page}.html`)).text();

    switch (page){
        case 'admin/users':{
            getAllUsers();
            break;
        }
    }
}

lightModeBtn.addEventListener('click', () =>{
    theme = 'light';
    setTheme(theme);
})
darkModeBtn.addEventListener('click', () =>{
    theme = 'dark';
    setTheme(theme);
})
function setTheme(theme){
 document.documentElement.setAttribute('data-bs-theme', theme);
 saveTheme(theme);
 setThemeBtnState();
}
function saveTheme(theme){
 localStorage.setItem('SCT', theme);
}

function loadTheme(){
    theme = 'light';
    if (localStorage.getItem('SCT')){
        theme = localStorage.getItem('SCT');
        if (theme == 'dark'){
            setThemeBtnState();
        }
    }
    setTheme(theme);
}
function setThemeBtnState(){
    lightModeBtn.classList.toggle('hide');
    darkModeBtn.classList.toggle('hide');
}


navigate('users/home');
loadTheme();