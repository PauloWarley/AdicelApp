import axios from "axios"

var HOST = process.env.HOST

export default async function Upload(req, res){

    var csvFile = ""
    
    csvFile = req.body

    // console.log(csvFile)

    // return

    csvFile = csvFile.replace(/\r/g, "").replace(/\t/g, "").replace(/"/g, "").replace(/'/g, "")

    csvFile = csvFile.split("\n")

    csvFile.splice (0, 4)

    csvFile.splice(csvFile.length-3, 3)

    
    // csvFile = [csvFile[0], csvFile[1], csvFile[2]]

    

    // return

    // return 
    // console.log("file ", req.body)

    var line

    var postJson = []

    var index = 0 
    var header = []

    // for (const property in csvFile){
    for (const property in csvFile){

        if( index === 0 ){

            // SEPARA AS COLUNAS POR ; OU ,
            // header = csvFile[property].split(";") 

            header = csvFile[property].split(";")

            console.log("header ", csvFile[property])
            

        }
        
        else {

            // SEPARA AS COLUNAS POR ; OU ,
            line = csvFile[property].split(";") 
            
            var json = {}

            // RESOLVE O BUG DO PRIMEIRO HEADER APARECENDO ENTRE ASPAS
            var text = header[0]
            text = text.slice(1, text.length)

            json[text] = line[0]

            console.log(json, line[0])
            // console.log(json, line[1])
            // console.log(json, line[2])
            // console.log(json, line[3])
            // console.log(json, line[4])
            // console.log(json, line[5])
            // console.log(json, line[6])
            // console.log(json, line[7])

            console.log("header.length", header.length)

            for(var i = 1; i < header.length; i ++){

                
                console.log("line[i]", line[i])

                if (json[header[i]] === undefined){
                    console.log(json[header[i]], line[i])
                }

                if (line[i] != undefined){

                        json[header[i]] = line[i].replace(",", ".")
                }
                else{
                    json[header[i]] = ""
                }
            }

            // json[header[1]] = line[1]
            
            postJson.push(json)

            console.log("Json: ", json)
            
        }

        index ++
    }


    console.log("json ", postJson)
  
    
    for (var i = 0; i < postJson.length; i ++){
    

        console.log("Upload ", postJson[i])

        var data = { produto : postJson[i]}


        await axios.post(`${HOST}/api/cadastro_produto`, data)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
  
    
    }

}