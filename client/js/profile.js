document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('jwt') === null){
        alert('Вы не авторизованы')
        window.location.href = '/'
    }
    else{
        var Profile = document.getElementById('profile')
        $.ajax({
            url: '/headerName',
            type: 'POST',
            data: {'jwt': sessionStorage.getItem('jwt')},
            success: user => {
                var user = JSON.parse(user);
                Profile.textContent = user.Role + ' : ' + user.Login;
            }
        });
        Profile.addEventListener('click', () => {
            window.location.href = '/'
        })
    }
})
