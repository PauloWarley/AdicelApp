import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'src/pages/api/success.wav')

const soundBuffer = fs.readFileSync(filePath)

const filePath2 = path.resolve('.', 'src/pages/api/alert.wav')

const soundBuffer2 = fs.readFileSync(filePath2)

export default function(req, res) {

    var state = req.query.state

    // console.log(state)

    if(state === 'true'){
        res.setHeader('Content-Type', 'audio/wav')
        res.send(soundBuffer)        
    }
    else if(state === 'false'){
        res.setHeader('Content-Type', 'audio/wav')
        res.send(soundBuffer2)              
    }
    else{   
        res.status(401).end()
    }
}