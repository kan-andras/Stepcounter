async function registration(){
    let name = document.querySelector('#name');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let confirm = document.querySelector('#confirm');

    const  response = await fetch('http://localhost:3000/admin/users');
    console.log(response);

    const data = await response.json();
    console.log(data);
}