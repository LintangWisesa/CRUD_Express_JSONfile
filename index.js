var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')

dataJson = fs.readFileSync('./data.json', 'utf8')
dataObj = JSON.parse(dataJson)
var app = express()

app.use('/files', express.static('storage'))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.send({"status": "Server aktif!"})
})

app.get('/data', (req, res)=>{
    if(req.query.max && req.query.min){
        hasil = []
        dataObj.map((value, index)=>{
            var nama = value.nama
            var usia = value.usia
            if(usia < req.query.max && usia > req.query.min){
                return hasil.push({
                    nama: nama, usia: usia
                })
            } else {
                return 'ok'
            }
        })
        res.send(hasil)
    }
    if(req.query.max && !req.query.min){
        hasil = []
        dataObj.map((value, index)=>{
            var nama = value.nama
            var usia = value.usia
            if(usia < req.query.max){
                return hasil.push({
                    nama: nama, usia: usia
                })
            } else {
                return 'ok'
            }
        })
        res.send(hasil)
    }
    if(!req.query.max && req.query.min){
        hasil = []
        dataObj.map((value, index)=>{
            var nama = value.nama
            var usia = value.usia
            if(usia > req.query.min){
                return hasil.push({
                    nama: nama, usia: usia
                })
            } else {
                return 'ok'
            }
        })
        res.send(hasil)
    } 
    else {
        res.send(dataObj)
    }
})

app.get('/data/:index', (req, res)=>{
    var i = req.params.index
    if(i > 0 && i - 1 < dataObj.length){
        res.send(dataObj[req.params.index - 1])
    } else {
        res.send({"status": "Maaf, data tidak tersedia"})
    }
})

app.post('/data', (req, res)=>{
    var dataBaru = {
        nama: req.body.name,
        usia: req.body.age
    }
    dataObj.push(dataBaru)
    var x = JSON.stringify(dataObj)
    fs.writeFileSync('data.json', x)
    res.send({
        nama: req.body.name,
        usia: req.body.age,
        status: 'Data sukses tersimpan'
    })
})

app.delete('/data/:index', (req, res)=>{
    dataObj.splice(req.params.index - 1, 1)
    var x = JSON.stringify(dataObj)
    fs.writeFileSync('data.json', x)
    res.send({
        status: `Data ke-${req.params.index} terhapus!`
    })
})

app.put('/data/:index', (req, res)=>{
    dataBaru = {
        nama: req.body.name,
        usia: req.body.age
    }
    dataObj.splice(req.params.index - 1, 1, dataBaru)
    var x = JSON.stringify(dataObj)
    fs.writeFileSync('data.json', x)
    res.send({
        status: `Data ke-${req.params.index} terupdate!`
    })
})

app.listen(1234, ()=>{
    console.log('Server sudah aktif di port 1234')
})