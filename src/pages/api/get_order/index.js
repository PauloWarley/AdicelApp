var HOST = process.env.HOST

export default function getOrder(req, res) { 


    if (req.method === "GET"){

        // ####### BUSCA TODOS PEDIDOS EM ABERTO #########
        
        var query = `
            SELECT 
                pedidos.id, 
                pedidos.Data, 
                pedidos.Nome_do_contato, 
                pedidos.ID_pedido, 
                pedidos.Loja, 
                pedidos.Transportadora, 
                pedidos.Situacao, 
                pedidos.Origem
            FROM pedidos
            WHERE 1=1
        `

        if (req.query.situacao != undefined){
            var situacoes = JSON.parse(req.query.situacao) 

            query = query + ` and ( pedidos.Situacao= '${situacoes[0]}' `
            for (var i = 1; i < situacoes.length; i ++){
                query = query +
                `or
                pedidos.Situacao= '${situacoes[i]}' `
            }
            query = query + ` ) `
        }

        
        if (req.query.romaneio != undefined){

            query = query + 
                `and pedidos.romaneio='${req.query.romaneio}'
                
                `
        }


        // console.log(query)
        
        let data={query : query}

        //console.log("INFO: ", data)

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

     