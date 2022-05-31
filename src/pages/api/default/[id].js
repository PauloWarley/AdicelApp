import axios from "axios";

var HOST = "http://localhost:3000"

HOST = process.env.HOST



export default function getDefault(req, res){

    if (req.method === "GET"){
        
        if(req.query.id === "endereco"){

            
            var query = `SELECT * FROM automate.default where nome_do_padrao='endereco_produto';`
        
            let data={query : query}

            console.log("INFO: ", data)

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
}