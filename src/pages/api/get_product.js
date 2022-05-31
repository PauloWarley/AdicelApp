var host = process.env.HOST
// host="http://localhost:3000"


export default function GetProduct (req, res) { 


    if (req.method === "GET"){


        //console.log("KEYS: ", req.body.pedido)

        // ####### BUSCA TODOS PRODUTO #########
        
        var query = `
            SELECT 
                produtos.ID, 
                produtos.Codigo, 
                produtos.Descricao, 
                produtos.Estoque, 
                produtos.Localizacao
            FROM produtos;
        `
        
        let data={query : query}

        //console.log("INFO: ", data)

        fetch(`${host}/api/database`, {
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

     