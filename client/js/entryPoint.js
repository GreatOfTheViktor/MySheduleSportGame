document.addEventListener('DOMContentLoaded', () => {
    var authBlock = document.getElementsByClassName('auth')[0]
    var regBlock = document.getElementsByClassName('reg')[0]
    var authVisibleBtn = document.getElementById('auth')
    var regVisibleBtn = document.getElementById('reg')
    var authBtn = document.getElementById('authentification')
    var regBtn = document.getElementById('registration')
    var userName = document.getElementById('userName')
    var emailForReg = document.getElementById('emailReg')
    var passForReg = document.getElementById('passw')
    var repeatPass = document.getElementById('repass')
    var usernameAuth = document.getElementById('usernameAuth')
    var passForAuth = document.getElementById('pass')
    authVisibleBtn.addEventListener('click', () => {
        ActiveElement(authVisibleBtn);
        NonActiveElement(regVisibleBtn);
    })
    regVisibleBtn.addEventListener('click', () => {
        ActiveElement(regVisibleBtn);
        NonActiveElement(authVisibleBtn);
    })
    repeatPass.addEventListener('input', e => {
        if (passForReg.value === e.target.value){
            e.target.style.borderColor = 'black';
        }
        else{
            e.target.style.borderColor = 'red';
        }
    })

    regBtn.addEventListener('click', () => {
        if (passForReg.value !== repeatPass.value){
            alert('Пароли должны совпадать!');
        }
        else{
            $.ajax({
                url: '/registration',
                type: 'POST',
                data: {'Login': userName.value, 'Password': passForReg.value, 'Email': emailForReg.value},
                success: jwt => {
                    if (jwt === 'IncorrectLogin'){
                        alert('Пожалуйста, введите корректный логин');
                    }
                    else if(jwt === 'SmallPass'){
                        alert('Пароль должен составлять не менее 5 символов');
                    }
                    else if(jwt === 'IncorrectEmail'){
                        alert('Некорректно введён email');
                    }
                    else{
                        sessionStorage.setItem('jwt', jwt);
                        window.location.href = '/games'
                    }
                }
            });
        }
    });
