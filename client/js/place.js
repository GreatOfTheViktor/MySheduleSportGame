document.addEventListener('DOMContentLoaded', () => {
    var container = document.getElementById('places')
    $.ajax({
        url: '/loadPlacesInfo',
        type: 'POST',
        success: data => {
            var places = JSON.parse(data)
            places.map(place => {
                container.insertAdjacentHTML('beforeend', `
                    <td>${place.Name}</td>
                    <td>${place.SportId}</td>
                    <td>${place.LocationId}</td>
                `)
            })
        }
    })
    document.getElementById('back').addEventListener('click', () => {
        window.location.href = '/games'
    })
})
