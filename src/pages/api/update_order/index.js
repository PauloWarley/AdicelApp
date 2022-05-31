import axios from "axios";

import database from "../database.js"

var HOST = "https://wmscloud.vercel.app/"
HOST = "https://wmscloud.vercel.app/"
HOST = process.env.HOST

export default function updateOrderId (req, res){

    // console.log(database)

    if (req.method === "PUT"){
        
        // req.body.id 
        // req.body.status 

        var status = req.body.idSituacao ?? 0

        var statusList = {
            1: "Pendente",
            2: "Em separação",
            3: "Aguardando NF",
            4: "Atendido",
            5: "Em falta"
        }

        var query =
            `UPDATE automate.pedidos SET Situacao = '${statusList[status]}', modified_date = now() 
            WHERE (id = '${req.body.idPedido}');
            
            `
            
            
        // console.log(query)

        let data={query : query}

        // console.log("INFO update DB: ", data, req.body)


        fetch(`${HOST}/api/database`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

            })
            .then( (response) => 
            response.json()
            .then( resp => {
                
                //console.log("response: ", resp, response.status )

                if (response.status == 200)
                {
                    //console.log("STATUS: ", 200)

                    // ### RESULTADO DA API ###
                    res.status(200).json(resp)
                }
                
            } 
                    
            )
        )
        
    
    }   
}