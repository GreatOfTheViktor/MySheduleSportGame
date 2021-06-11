document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('jwt') === null){
        alert('Вы не авторизованы')
        window.location.href = '/'
    }
    else{
        var selPlace = document.getElementById('place')
        $.ajax({
            url:'/loadPlaces',
            type: 'POST',
            data: {'jwt': sessionStorage.getItem('jwt')},
            success: places => {
                if (places === 'NoAccess'){
                    window.location.href = '/games'
                }
                else if(places === 'NonAuthorization'){
                    window.location.href = '/'
                }
                else{
                    JSON.parse(places).map(place => {
                        selPlace.insertAdjacentHTML('afterbegin', `
                            <option>${place.Name}</option>
                        `)
                    })
                    document.getElementById('confirm').addEventListener('click', () => {
                        let startDate = document.getElementById('dateStart').value
                        let startTime = document.getElementById('timeStart').value
                        let endDate = document.getElementById('dateEnd').value
                        let endTime = document.getElementById('timeEnd').value
                        let description = document.getElementById('desc').value
                        let place = document.getElementById('place').value
                        if (startTime.match(/^[0-9]{2}\:[0-9]{2}$/) === null
                            || endTime.match(/^[0-9]{2}\:[0-9]{2}$/) === null
                        ){
                            alert('Неверный формат времени')
                            document.getElementById('timeStart').value = '00:00'
                            document.getElementById('timeEnd').value = '00:00'
                        }
                        else{
                            $.ajax({
                                url: '/addSchedule',
                                type: 'POST',
                                data: { startDate, startTime, endDate, endTime, description, place },
                                success: res => {
                                    alert(res)
                                    window.location.href = '/games'
                                }
                            })
                        }
                    })
                }
            }
        })
        document.getElementById('back').addEventListener('click', () => {
            window.location.href = '/games'
        })
    }
})
