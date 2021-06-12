const mysql = require('mysql2');
const config = require('../../config/config.json');
const jwt = require('jsonwebtoken')
const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password
}).promise()
const secret = config.secret

const LoadData = (req, res) => {
    let token = req.body.jwt
    let user = jwt.verify(token, secret)
    db.query(`SELECT * FROM Schedule`).then(data => {
        db.query(`SELECT * FROM Place`).then(places => {
            res.send(HtmlCode(user.userRole, data[0], places[0]))
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
}

const ReplaceData = (req, res) => {
    let id = req.body.id
    let StartDate = req.body.StartDate
    let EndDate = req.body.EndDate
    let description = req.body.description
    let placeName = req.body.placeName
    let i = 0
    const QueryCounter = i => {
        db.query(`SELECT idPlace FROM Place WHERE Name = '${placeName[i]}'`).then(IdOfPlace => {
            db.query(`UPDATE Schedule SET StartDateTime = '${StartDate[i]}', EndDateTime = '${EndDate[i]}', Description = '${description[i]}', PlaceId = ${IdOfPlace[0][0].idPlace} WHERE idSchedule = ${id[i]}`).then(data => {
                if (i === id.length - 1){
                    res.send('Информация успешно обновлена')
                }
                else{
                    i++
                    QueryCounter(i)
                }
            }).catch(err => {
                console.log('Error in ' + i + ' row: ' + err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
    QueryCounter(i)
}

const RemoveSchedule = (req, res) => {
    db.query(`DELETE FROM Schedule WHERE idSchedule = ${req.body.id}`).then(data => {
        res.send('Запись успешно удалена')
    }).catch(err => {
        res.send('Непредвиденная ошибка сервера')
    })
}

const LoadPlaces = (req, res) => {
    let token = req.body.jwt
    if (!token){
        res.send('NonAuthorization')
    }
    else{
        let user = jwt.verify(token, secret)
        if (user.userRole !== 1){
            res.send('NoAccess')
        }
        else{
            db.query(`SELECT Name FROM Place`).then(names => {
                res.send(JSON.stringify(names[0]))
            }).catch(err => {
                console.log(err)
            })
        }
    }
}

const AddSchedule = (req, res) => {
    let startDate = req.body.startDate
    let startTime = req.body.startTime
    let endDate = req.body.endDate
    let endTime = req.body.endTime
    let desc = req.body.description
    let placeName = req.body.place
    db.query(`SELECT idPlace FROM Place WHERE Name = '${placeName}'`).then(id => {
        db.query(`INSERT INTO Schedule (StartDateTime, EndDateTime, Description, PlaceId) VALUES ('${startDate} ${startTime}:00.000000', '${endDate} ${endTime}:00.000000', '${desc}', ${id[0][0].idPlace})`).then(data => {
            res.send('Запись успешно добавлена!')
        }).catch(err => {
            res.send('Непредвиденная ошибка сервера ' + err)
        })
    }).catch(err => {
        res.send('Непредвиденная ошибка сервера ' + err)
    })
}

const AddPlace = (req, res) => {
    let Name = req.body.name
    let SportName = req.body.sport
    let AdressName = req.body.adress
    db.query(`SELECT idSport FROM Sport WHERE Name = '${SportName}'`).then(idSport => {
        db.query(`SELECT idLocation FROM Location WHERE Name = '${AdressName}'`).then(idLocation => {
            db.query(`INSERT INTO Place (Name, SportId, LocationId) VALUES ('${Name}', ${idSport[0][0].idSport}, ${idLocation[0][0].idLocation})`).then(data => {
                res.send('Информация успешно добавлена')
            }).catch(err => {
                console.log('InsertError ' + err)
                res.send('Непредвиденная ошибка на сервере')
            })
        }).catch(err => {
            console.log('Location Select Error ' + err)
            res.send('Непредвиденная ошибка на сервере')
        })
    }).catch(err => {
        console.log('Sport Select Error ' + err)
        res.send('Непредвиденная ошибка на сервере')
    })
}

const LoadSport = (req, res) => {
    let token = req.body.jwt
    let user = jwt.verify(token, secret)
    if (user.userRole !== 1){
        res.send('NoAccess')
    }
    else{
        db.query(`SELECT Name FROM Sport`).then(names => {
            res.send(JSON.stringify(names[0]))
        }).catch(err => {
            console.log('Sport Load Error: ' + err)
        })
    }
}

const LoadAdress = (req, res) => {
    db.query(`SELECT * FROM Location`).then(locations => {
        res.send(JSON.stringify(locations[0]))
    }).catch(err => {
        console.log('Adress Load Error: ' + err)
    })
}

const LoadPlacesInfo = (req, res) => {
    var places = []
    db.query(`SELECT * FROM Place`).then(data => {
        places = data[0]
        data[0].map((onePlace, idx) => {
            db.query(`SELECT Name FROM Sport WHERE idSport = ${onePlace.SportId}`).then(NameOfSport => {
                db.query(`SELECT Address, Name FROM Location WHERE idLocation = ${onePlace.LocationId}`).then(NameOfLocation => {
                    places[idx].SportId = NameOfSport[0][0].Name
                    places[idx].LocationId = NameOfLocation[0][0].Address + ' ' + NameOfLocation[0][0].Name
                    if (idx === (data[0].length - 1)){
                        res.send(JSON.stringify(places))
                    }
                }).catch(err => {
                    console.log('Err Selected Names Of Location ' + err)
                })
            }).catch(err => {
                console.log('Err Selected Names Of Sport' + err)
            })
        })
    }).catch(err => {
        console.log('Err Selected Places' + err)
    })
}

const AddSport = (req, res) => {
    db.query(`INSERT INTO Sport (Name) VALUES ('${req.body.name}')`).then(data => {
        res.send('Вид спорта успешно добавлен')
    }).catch(err => {
        res.send('Непредвиденная ошибка сервера')
    })
}

const AddAdress = (req, res) => {
    db.query(`INSERT INTO Location (Name, Address) VALUES ('${req.body.name}', '${req.body.adr}')`).then(data => {
        res.send('Адрес успешно добавлен')
    }).catch(err => {
        console.log(err)
        res.send('Непредвиденная ошибка сервера')
    })
}

module.exports = {
    LoadData,
    ReplaceData,
    RemoveSchedule,
    LoadPlaces,
    AddSchedule,
    AddPlace,
    LoadSport,
    LoadAdress,
    LoadPlacesInfo,
    AddSport,
    AddAdress
}

//-----------------------------------------------------------------------------
const HtmlCode = (role, data, Places) => {
    let code = `
                    <table border="1">
                        <tr>
                            <th>Время начала</th>
                            <th>Время окончания</th>
                            <th>Описание</th>
                            <th>Место проведения</th>
                        </tr>`;
    if (role === 0){
        data.map((schedule, index) => {
            let StartDate = new Date(Date.parse(schedule.StartDateTime))
            let EndDate = new Date(Date.parse(schedule.EndDateTime))
            code += `
                <tr>
                    <td>
                        <span>${NormalizeDate(StartDate, role)}</span>
                        <span>${NormalizeTime(StartDate)}</span>
                    </td>
                    <td>
                        <span>${NormalizeDate(EndDate, role)}</span>
                        <span>${NormalizeTime(EndDate)}</span>
                    </td>
                    <td>${schedule.Description}</td>
                    <td>${Places[index].Name}</td>
                </tr>   
            `
        })
    }
    else if (role === 1){
        data.map((schedule, index) => {
            let StartDate = new Date(Date.parse(schedule.StartDateTime))
            let EndDate = new Date(Date.parse(schedule.EndDateTime))
            code += `
                <tr id = "${schedule.idSchedule}">
                    <td>
                        <input type = "date" value = "${NormalizeDate(StartDate, role)}">
                        <input type = "text" value = "${NormalizeTime(StartDate)}">
                    </td>
                    <td>
                        <input type = "date" value = "${NormalizeDate(EndDate, role)}">
                        <input type = "text" value = "${NormalizeTime(EndDate)}">
                    </td>
                    <td><textarea rows = "3">${schedule.Description}</textarea></td>
                    <td>
                        <select>
                            ${Places.map(place => {
                if (place.idPlace === schedule.PlaceId){
                    return `<option selected value=${place.Name}>${place.Name}</option>`
                }
                else{
                    return `<option value="${place.Name}">${place.Name}</option>`
                }
            })}
                        </select>
                    </td>
                    <td><button class = "remove">Удалить игру</button></td>
                </tr>
            `
        })
        code += `</table>
            <div class = "butBlock">
                <button class = "but" id = "Confirm">Подтвердить изменения</button>
                <button class = "but" id = "add">Добавить игру</button>
                <button class = "but" id = "addPlace">Добавить место</button>
            </div>
        `;
    }
    return code
}

const NormalizeDate = (MyDate, role) => {
    let Month = `${MyDate.getMonth() + 1}`
    let Days = `${MyDate.getDate()}`
    if (Month.length === 1){
        Month = `0${MyDate.getMonth() + 1}`
    }
    if (Days.length === 1){
        Days = `0${MyDate.getDate()}`
    }
    if (role === 1){
        return `${MyDate.getFullYear()}-${Month}-${Days}`
    }
    else{
        return `${Days}.${Month}.${MyDate.getFullYear()}`
    }
}

const NormalizeTime = MyDate => {
    let Hours = `${MyDate.getHours()}`
    let Minutes = `${MyDate.getMinutes()}`
    if (Hours.length === 1){
        Hours = `0${MyDate.getHours()}`
    }
    if (Minutes.length === 1){
        Minutes = `0${MyDate.getMinutes()}`
    }
    return `${Hours}:${Minutes}`
}
