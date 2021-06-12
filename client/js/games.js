document.addEventListener('DOMContentLoaded', () => {
    var Table
    var Profile = document.getElementById('profile')
    document.getElementById('morePlaces').addEventListener('click', () => {
        window.location.href = '/viewPlaces'
    })
    $.ajax({
        url:'/loadData',
        type: 'POST',
        data: { 'jwt': sessionStorage.getItem('jwt') },
        success: html => {
            Profile.insertAdjacentHTML('afterend', html)
            document.getElementById('Confirm').addEventListener('click', () => {
                Row = document.getElementsByTagName('tr')
                let id = []
                let SD = []
                let ST = []
                let StartDate = []
                let ED = []
                let ET = []
                let EndDate = []
                let desc = []
                let placeName = []
                for (var i = 1; i < Row.length; i++){
                    id.push(Row[i].id)
                    SD.push(Row[i].getElementsByTagName('td')[0].getElementsByTagName('input')[0].value)
                    if (Row[i].getElementsByTagName('td')[0].getElementsByTagName('input')[1].value.match(/^[0-9]{2}\:[0-9]{2}$/) === null){
                        alert('Неверный формат времени!')
                        window.location.href = '/games'
                        return 0
                    }
                    else{
                        ST.push(Row[i].getElementsByTagName('td')[0].getElementsByTagName('input')[1].value)
                    }
                    ST.push(Row[i].getElementsByTagName('td')[0].getElementsByTagName('input')[1].value)
                    ED.push(Row[i].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value)
                    if (Row[i].getElementsByTagName('td')[1].getElementsByTagName('input')[1].value.match(/^[0-9]{2}\:[0-9]{2}$/) === null){
                        alert('Неверный формат времени!')
                        window.location.href = '/games'
                        return 0
                    }
                    else{
                        ET.push(Row[i].getElementsByTagName('td')[1].getElementsByTagName('input')[1].value)
                    }
                    desc.push(Row[i].getElementsByTagName('td')[2].getElementsByTagName('textarea')[0].value)
                    placeName.push(Row[i].getElementsByTagName('td')[3].getElementsByTagName('select')[0].value)
                }
                SD.map((item, index) => {
                    let newItem = item + ' ' + ST[index] + ':00.000000'
                    StartDate.push(newItem)
                })
                ED.map((item, index) => {
                    let newItem = item + ' ' + ET[index] + ':00.000000'
                    EndDate.push(newItem)
                })
                $.ajax({
                    url: '/replaceSchedules',
                    type: 'POST',
                    data: { id, StartDate, EndDate, 'description': desc, placeName },
                    success: responce => {
                        alert(responce);
                        window.location.href = '/games'
                    }
                })
            })
            for (var i = 0; i < document.getElementsByClassName('remove').length; i++){
                document.getElementsByClassName('remove')[i].addEventListener('click', e => {
                    $.ajax({
                        url: '/removeSchedule',
                        type: 'POST',
                        data: {'id': e.target.parentElement.parentElement.id},
                        success: data => {
                            alert(data)
                            window.location.href = '/games'
                        }
                    })
                })
            }
            document.getElementById('add').addEventListener('click', () => {
                window.location.href = '/addGame'
            })
            document.getElementById('addPlace').addEventListener('click', () => {
                window.location.href = '/placeManager'
            })
        }
    })
});
