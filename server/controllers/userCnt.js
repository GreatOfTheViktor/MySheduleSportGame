const mysql = require('mysql2');
const config = require('../../config/config.json');
const jwt = require('jsonwebtoken');
const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password
}).promise();
const secret = config.secret;

const CreateUser = (req, res) => {
    var Login = req.body.Login;
    var Password = req.body.Password;
    var Email = req.body.Email;
    var RoleId = 0;
    if (Login.match(/^[a-zA-Z0-9\_\-]*$/) === null){
        res.send('IncorrectLogin')
    }
    else if(Password.length < 5){
        res.send('SmallPass')
    }
    else if(Email.match(/^[a-zA-Z0-9\-\_\.]*\@[a-zA-Z]*\.[a-zA-Z]{2,3}$/) === null){
        res.send('IncorrectEmail')
    }
    else{
        db.query(`INSERT INTO User (Login, Password, Email, RoleId) VALUES ('${Login}', '${Password}', '${Email}', ${RoleId})`).then(data => {
            res.send(jwt.sign({'id': data[0].insertId, 'userRole': 0}, secret));
        }).catch(err => {
            console.log(err);
        });
    }
}

const SelectName = (req, res) => {
    var user = jwt.verify(req.body.jwt, secret);
    let Login;
    let Role;
    db.query(`SELECT Login FROM User WHERE idUser = ${user.id}`).then(data => {
        Login = data[0][0].Login;
        db.query(`SELECT Name FROM Role WHERE idRole = ${user.userRole}`).then(data => {
            Role = data[0][0].Name;
            res.send(JSON.stringify({Login, Role}));
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
}

const Authorization = (req, res) => {
    var login = req.body.login;
    var password = req.body.password;
    if (login.match(/^[a-zA-Z0-9\_\-]*$/) === null){
        res.send('IncorrectLogin');
    }
    else{
        db.query(`SELECT * FROM User WHERE Login = '${login}'`).then(data => {
            if (data[0][0]){
                if (data[0][0].Password === password){
                    res.send(jwt.sign({'id': data[0][0].idUser, 'userRole': data[0][0].RoleId}, secret));
                }
                else{
                    res.send('NotFound');
                }
            }
            else{
                res.send('NotFound');
            }
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = {
    CreateUser,
    SelectName,
    Authorization,
}
