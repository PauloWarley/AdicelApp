import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'src/dist/modelo_upload_produto.csv')
// const filePath = path.resolve('.', 'src/dist/loading.svg')


const fileBuffer = fs.readFileSync(filePath)

export default function(req, res) {

    var id = req.query.id

    console.log(id)

    if(id === 'modelo_upload_produto.csv'){
        // res.setHeader('Content-Type', 'text')
        res.send(fileBuffer)        
    }

    else{   
        res.status(404).end()
    }
}
