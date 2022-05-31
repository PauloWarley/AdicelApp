var host = process.env.HOST
// host="http://localhost:3000"

export default async function getPedido(req, res) { 

    async function get(){
        return new Promise( (resolve, reject) => {
            // console.log("KEYS: ", req.query.transportadora, req.query.loja)

            // ####### BUSCA TODOS PEDIDOS EM ABERTO #########
            
            var query = ``

            if (req.query.transportadora != "" && req.query.loja != ""){
                query = `
                    SELECT 
                        pedidos.id, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao,
                        pedidos.ID_pedido
                    FROM pedidos_produtos
                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido and
                        pedidos.Situacao="Pendente" and
                        (pedidos.Transportadora='${req.query.transportadora}' or
                        pedidos.Loja='${req.query.loja}')

                    INNER JOIN produtos
                    ON
                        pedidos_produtos.ID_produto = produtos.Codigo
                    
                    
                `
            }
            else if (req.query.loja === "" && req.query.transportadora === ""){
                
                query = `
                    SELECT 
                        pedidos.id, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao
                    FROM pedidos_produtos
                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido
                        and pedidos.Situacao="Pendente" 

                        #and pedidos.ID_pedido = "19626"

                        #and pedidos.Transportadora<>'Sem Transporte'
                        and (
							pedidos.Loja='Shopee' or
							pedidos.Loja='MercadoLivre' or
                            pedidos.Loja='ViaVarejo' or
							pedidos.Transportadora='TEX COURIER LTDA' or
							pedidos.Transportadora='ECT - Empresa Brasileira de Correios e Telégrafos' or
							pedidos.Transportadora='Mandaê Serviço de Consultoria de Logística'
							#pedidos.Transportadora='Adicel'
                        )
                        
                    INNER JOIN produtos
                    ON
                        pedidos_produtos.ID_produto = produtos.Codigo
                    
                `
            }
            else if (req.query.transportadora === ""){
                query = `
                    SELECT 
                        pedidos.id, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao
                    FROM pedidos_produtos

                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido and
                        pedidos.Situacao="Pendente" and
                        pedidos.Loja='${req.query.loja}'

                    INNER JOIN produtos
                    ON
                        pedidos_produtos.ID_produto = produtos.Codigo
                    
                `
            }
            else if (req.query.loja === ""){
                query = `
                    SELECT 
                        pedidos.id, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao
                    FROM pedidos_produtos
                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido and
                        pedidos.Situacao="Pendente" and
                        pedidos.Transportadora='${req.query.transportadora}'

                    INNER JOIN produtos
                    ON
                        pedidos_produtos.ID_produto = produtos.Codigo
                    
                `
            }        
            

            /* VOLTAR A LOCALIZAÇÃO */

            
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

                        // console.log(resp)

                        var pedidosOnPicking = []

                        var itens = []

                        for (const property in resp){

                            
                            if (!pedidosOnPicking.includes(resp[property].id)){

                                pedidosOnPicking.push(resp[property].id)

                            }

                            if (!itens.includes(resp[property].ID_produto)){

                                itens.push(resp[property].ID_produto)

                            }

                        }
                        
                        // console.log(itens)
                        
                        var listItens = []

                        for (const i in itens){

                            var listItem = {}
                            listItem["Quantidade"]  = 0

                            for (const j in resp){

                                if(resp[j].ID_produto === itens[i]){

                                    listItem["id"] = resp[j].id 
                                    listItem["ID_produto"] = resp[j].ID_produto 
                                    listItem["Descricao"] = resp[j].Descricao 
                                    listItem["Quantidade"] =  listItem["Quantidade"] + resp[j].Quantidade 
                                    listItem["Descricao"] = resp[j].Descricao 
                                    listItem["Localizacao"] = resp[j].Localizacao 
                                }


                            }

                            listItens.push(listItem)


                        }

                        res.status(200).json([listItens, pedidosOnPicking])
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

     