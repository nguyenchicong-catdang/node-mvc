// frontend/admin/login/login.js

function handlerSubmit() {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    })
}

async function requestServer(form) {
    try {
        const formData = new FormData(form);
        const erorMessage = form.querySelector('.error-message');
        const response = await fetch('/auth/login', {
            method: "POST",
            body: formData,
        });
        //const response = await fetch('/api/admin/?TestController@index');
        const result = await response.json();
        if (result.success) {
            //console.log(1)
            form.reset();
            window.location = '/admin';
        }
        if (result.error) {
            erorMessage.innerHTML = 'Tài khoản hoặc mật khẩu không đúng';
            form.reset();
            // console.log(2)
        }
        //console.log(result);
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handlerSubmit();
})