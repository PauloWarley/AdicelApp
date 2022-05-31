import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'src/dist/loading.svg')

const fileBuffer = fs.readFileSync(filePath)


export default function(req, res) {

    var id = req.query.id

    if(id === 'loading.svg'){
        res.setHeader('Content-Type', 'image/xml+svg')
        res.send(fileBuffer)
    }


    else{   
        res.status(401).end()
    }
}