document.addEventListener('DOMContentLoaded', () => {
    var sport = document.getElementById('sport')
    var adressName = document.getElementById('adressName')
    var Adresses = []
    $.ajax({
        url: '/loadSport',
        type: 'POST',
        data: {'jwt': sessionStorage.getItem('jwt')},
        success: sports => {
            if (sports === 'NoAccess'){
                alert('Недостаточно прав')
                window.location.href = '/games'
            }
            else{
                $.ajax({
                    url:'/loadAdress',
                    type:'POST',
                    success: adresses => {
                        JSON.parse(sports).map(onesp => {
                            sport.insertAdjacentHTML('afterbegin', `
                                <option>${onesp.Name}</option>
                            `)
                        })
                        JSON.parse(adresses).map(onead => {
                            adressName.insertAdjacentHTML('afterbegin', `
                                <option>${onead.Name}</option>
                            `)
                            Adresses.push({ name: onead.Name, adress: onead.Address})
                        })
                        document.getElementById('savePlace').addEventListener('click', () => {
                            var name = document.getElementById('placeName').value
                            $.ajax({
                                url: '/addPlace',
                                type: 'POST',
                                data: { name, 'sport':sport.value , 'adress': adressName.value},
                                success: msg => {
                                    alert(msg)
                                    window.location.href = '/games'
                                }
                            })
                        })
                        Adresses.map(oneAdress => {
                            if (oneAdress.name === adressName.value){
                                document.getElementById('coordinates').textContent = oneAdress.adress
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
    document.getElementById('addSport').addEventListener('click', () => {
        var name = prompt('Введите название вида спорта')
        if (!name){
            alert('Операция отменена')
        }
        else{
            $.ajax({
                url:'/addSport',
                type: 'POST',
                data: { name },
                success: msg => {
                    alert(msg)
                    window.location.href = '/placeManager'
                }
            })
        }
    })

    document.getElementById('addAdr').addEventListener('click', () => {
        var name = prompt('Введите наименование локации')
        var adr
        if (!name){
            alert('Операция отменена')
        }
        else{
            adr = prompt('Введите адрес локации (страну)')
            if (!adr){
                alert('Операция отменена')
            }
            else{
                $.ajax({
                    url: '/addAdress',
                    type: 'POST',
                    data: { name , adr},
                    success: msg => {
                        alert(msg)
                        window.location.href = '/placeManager'
                    }
                })
            }
        }
    })
    adressName.addEventListener('change', e => {
        Adresses.map(oneAdress => {
            if (oneAdress.name === e.target.value){
                document.getElementById('coordinates').textContent = oneAdress.adress
            }
        })
    })
})
