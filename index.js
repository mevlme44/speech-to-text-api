const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
require('custom-env').env('staging')

const PORT = process.env.PORT || 5051
const app = express()
const options = {
    inflate: true,
    limit: '5mb',
    type: 'audio/wave'
}

app.use(bodyParser.raw(options))
app.use(express.json())

const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    }catch (e){
        console.log(e)
    }
}

app.post('/api/recognize', async (req, res) => {
    let data =req.body
    console.log(data)
    fetch('https://voice.mcs.mail.ru/asr', {
        method: 'post',
        body: data,
        headers: {
            'Content-Type': 'audio/wave',
            'Authorization': `Bearer ${process.env.ACCESS_KEY}`
        },
    })
        .then(res => res.json())
        .then(json => res.status(200).send(json.result.texts[0].punctuated_text))
        .catch(err => res.status(400).send(err))
})

start()