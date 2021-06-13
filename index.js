const express = require('express')
const bParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const UC = require('./server/controllers/userCnt')
const DC = require('./server/controllers/dataCnt')
//---------------------------------------------------
var port = process.env.PORT || 3000
var mypath = __dirname + '/public/html/'
app.use(bParser.urlencoded({extended: true}))
app.use(express.static('public'))
server.listen(port)
//---------------------------------------------------
app.get('/', (req, res) => {
    res.sendFile(mypath + 'entryPoint.html')
})
app.get('/games', (req, res) => {
    res.sendFile(mypath + 'games.html')
})
app.get('/addGame', (req, res) => {
    res.sendFile(mypath + 'addGame.html')
})
app.get('/placeManager', (req, res) => {
    res.sendFile(mypath + 'placeManager.html')
})
app.get('/viewPlaces', (req, res) => {
    res.sendFile(mypath + 'places.html')
})
app.post('/registration', UC.CreateUser)
app.post('/login', UC.Authorization)
app.post('/headerName', UC.SelectName)
app.post('/loadData', DC.LoadData)
app.post('/replaceSchedules', DC.ReplaceData)
app.post('/removeSchedule', DC.RemoveSchedule)
app.post('/loadPlaces', DC.LoadPlaces)
app.post('/addSchedule', DC.AddSchedule)
app.post('/addPlace', DC.AddPlace)
app.post('/loadSport', DC.LoadSport)
app.post('/loadAdress', DC.LoadAdress)
app.post('/loadPlacesInfo', DC.LoadPlacesInfo)
app.post('/addSport', DC.AddSport)
app.post('/addAdress', DC.AddAdress)
