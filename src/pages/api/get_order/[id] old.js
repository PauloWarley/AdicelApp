import axios from "axios";

import database from "../database.js"

var HOST = process.env.HOST

export default async function getOrderId (req, res){

    // console.log("", req.query.situacao)

    async function get(){
        return new Promise((resolve, reject) => {
            // req.query.id 
            // console.log(req.query.romaneio)

            

            // var situacoes = JSON.parse (req.query.situacao) 

            // console.log(situacoes)

            var query =
                    `SELECT 
                        pedidos.id, 
                        pedidos.data, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao,
                        produtos.Imagem,
                        pedidos.ID_pedido,
                        pedidos.N_NFe,
                        pedidos_produtos.GTIN,
                        produtos.Cod_Barra
                    FROM pedidos_produtos

                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido and                    
                        pedidos.id='${req.query.id}'`
            
            if (req.query.romaneio != undefined){
                query = query +
                `and
                pedidos.romaneio= '${req.query.romaneio}' `
            }

            if (req.query.situacao != undefined){
                query = query +
                `and
                pedidos.Situacao= '${req.query.situacao}' `
            }
            
            
            query = query +
                `INNER JOIN produtos
                ON 
                    pedidos_produtos.ID_produto = produtos.Codigo;
                `
            
        
            let data={query : query}

            console.log("INFO: ", query)


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
                        resolve()
                    }
                    
                } 
                        
                )
            )
        })
    }

    if (req.method === "GET"){
        
        await get()        
    
    }   
}