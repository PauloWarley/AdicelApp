import axios from "axios";

var HOST = process.env.HOST

export default async function getOrderId (req, res){

    // console.log("teste", req.query)

    async function get(){

        
        return new Promise(async function(resolve, reject)  {

                
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
                var situacoes = JSON.parse(req.query.situacao) 

                query = query + ` and ( pedidos.Situacao= '${situacoes[0]}' `
                for (var i = 1; i < situacoes.length; i ++){
                    query = query +
                    `or
                    pedidos.Situacao= '${situacoes[i]}' `
                }
                query = query + ` ) `
            }
            
            
            query = query +
                `INNER JOIN produtos
                ON 
                    pedidos_produtos.ID_produto = produtos.Codigo;
                `

            let data={query : query}


            var response = (await axios.post(`${HOST}/api/database`, data))

            if(response != undefined){
                res.status(200).json(response.data)
            }
            
            resolve()

        })
    }

    if (req.method === "GET"){
        
        await get()        
    
    }   
}