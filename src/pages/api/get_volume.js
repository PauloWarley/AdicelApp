/*
    LIQUIDOS IRÃO SEMPRE EM PÉ
    SACOS POSSUEM UM VOLUME PRÓPRIO
*/

var HOST = process.env.HOST

var axios = require("axios")

export default async function getEmbalagem(req, res) { 

    async function get(){

        var id

        return new Promise(async function(resolve, reject){
        // console.log("KEYS: ", id)

        // ####### BUSCA TODOS PEDIDOS EM ABERTO #########
            
            var pedidos = []

            var response = []

            if (req.query.id != undefined){
                pedidos = [{id: req.query.id}]
            }
            else {
                pedidos = (await axios.post(`${HOST}/api/database`, 
                {query: "SELECT id FROM automate.pedidos where Loja<>'Api' and Situacao<>'Cancelado' order by 1 desc /*limit 100*/"})).data

            }

            // console.log(pedidos)
            
            for (var i in pedidos){
                
                id = pedidos[i].id

                // console.log("ID: ", id)

                var query = `
                    SELECT 
                        pedidos.id, 
                        pedidos_produtos.ID_produto, 
                        pedidos_produtos.Descricao, 
                        pedidos_produtos.Quantidade,
                        pedidos.Loja, 
                        pedidos.Transportadora,
                        produtos.Localizacao,
                        pedidos_produtos.unidade as unidade_produto_pedido,
                        produtos.unidade as unidade_produto,
                        produtos.Largura,
                        produtos.Altura,
                        produtos.Profundidade,
                        produtos.Orientacao
                    FROM pedidos_produtos
                    INNER JOIN pedidos 
                    ON 
                        pedidos_produtos.ID_pedido = pedidos.ID_pedido and
                        pedidos.id='${id}'

                    INNER JOIN produtos
                    ON 
                        pedidos_produtos.ID_produto = produtos.Codigo;
                `
                
                let data={query : query}

                var resp = (await axios.post(`${HOST}/api/database`, data)).data
                
                // ### RESULTADO DA API ###

                // console.log("Resposta da API: ", resp)

                var itens = []

                for (const property in resp){

                    if (!itens.includes(resp[property].ID_produto)){

                        itens.push(resp[property].ID_produto)

                    }

                }
                
                // console.log("itens", itens)
                
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
                            listItem["unidade"] =  resp[j].unidade_produto
                            listItem["Descricao"] = resp[j].Descricao 
                            listItem["Localizacao"] = resp[j].Localizacao 
                            listItem["Largura"] = resp[j].Largura 
                            listItem["Altura"] = resp[j].Altura 
                            listItem["Profundidade"] = resp[j].Profundidade 
                            listItem["Orientacao"] = resp[j].Orientacao 
                        }
                    }
                    listItens.push(listItem)

                }

                var pdMedidas = []

                // console.log(listItens)

                for (const i in listItens){

                    var medida = [listItens[i].Altura,listItens[i].Largura,listItens[i].Profundidade].sort(function(a, b) {
                        return a - b;
                    })

                    if (listItens[i].Orientacao === "v" || true){
                        medida = [medida[0], medida[2], medida[1]]
                    }

                    pdMedidas.push({
                        ID_produto : listItens[i].ID_produto,
                        Medida : medida,
                        Quantidade: listItens[i].Quantidade,
                        Unidade: listItens[i].unidade

                    })
                }

                //"Converte" todos produtos no primeiro item

                var larguraEquivalente = 0, qntdEquivalente = 0,
                alturaEquivalente = 0,
                profundidadeEquivalente = 0

                for (var i = 0; i < pdMedidas.length; i ++){

                    larguraEquivalente = pdMedidas[i].Medida[0]/pdMedidas[0].Medida[0]
                    
                    alturaEquivalente = pdMedidas[i].Medida[1]/pdMedidas[0].Medida[1]
                    
                    profundidadeEquivalente = pdMedidas[i].Medida[2]/pdMedidas[0].Medida[2]
                
                    qntdEquivalente =  qntdEquivalente + (pdMedidas[i].Quantidade * larguraEquivalente * alturaEquivalente * profundidadeEquivalente)

                }

                
                

                var produtos = pdMedidas

                var query = `
                    SELECT * FROM automate.embalagens;
                `
                
                data={query : query}

                var resp = (await axios.post(`${HOST}/api/database`, data)).data

                var cxMedidas  = []

                for (var i in resp){

                    cxMedidas.push({
                        Modelo : resp[i].Modelo,
                        Medida : [resp[i].Altura,resp[i].Largura,resp[i].Profundidade]
                    }
                    )

                }

                var medida1 = 0, medida2 = 0, medida3 = 0, volume = 0, caixas = [], razao_altura = 0

                restartLoop:
                while (true) {
                    for (var obj = 0; obj < pdMedidas.length; obj++){
                        console.log(obj, pdMedidas.length)
                    
                        if(pdMedidas[obj].Unidade === "SC"){
                            for (var j = 0; j < pdMedidas[obj].Quantidade; j++){
                                caixas.push(pdMedidas[obj].Unidade )
                                volume ++
                            }     
                            pdMedidas = pdMedidas.filter(function(item){
                                return item.ID_produto != pdMedidas[obj].ID_produto
                            })
                            continue restartLoop;
                        }
                        
                    }
                break;
                }

                if (pdMedidas.length > 0){

                    for (var cx in cxMedidas){

                                
                        // console.log(cxMedidas, pdMedidas, qntdEquivalente)
                        
                        medida1 = cxMedidas[cx].Medida[0]/pdMedidas[0].Medida[0]

                        medida2 = cxMedidas[cx].Medida[1]/pdMedidas[0].Medida[1]

                        medida3 = cxMedidas[cx].Medida[2]/pdMedidas[0].Medida[2]

                        razao_altura = cxMedidas[cx].Medida[0]/pdMedidas[0].Medida[1]

                        // console.log(medida1*medida2*medida3, qntdEquivalente)

                        if (medida1*medida2*medida3 >= qntdEquivalente && razao_altura >= 1){

                            caixas.push(cxMedidas[cx].Modelo)
                            volume ++

                            break

                        }
                        else if (cxMedidas.indexOf(cxMedidas[cx]) === cxMedidas.length-1){

                            if (medida1*medida2*medida3 < qntdEquivalente){
                                caixas.push(cxMedidas[cx].Modelo)
                                
                                volume ++
                                qntdEquivalente = medida1*medida2*medida3 -qntdEquivalente

                                
                            }
                        }
                    }

                }

                
                resolve()
                
                
                // response.push([produtos, {Modelo: caixas, Volume: volume}])
                // response.push({ID: id, Modelo: caixas, Volume: volume})

                for (var cx in produtos){
                    
                    // response.push(JSON.stringify(produtos[cx].Medida))
                    response.push(JSON.stringify([id, produtos[cx].ID_produto, produtos[cx].Medida, produtos[cx].Quantidade, produtos[cx].Unidade]).replace(/[\[\]"]+/g, ''))
                }

        
            }

            res.status(200).json(response)
        })
                
    }


    if (req.method === "GET"){

        await get()

    }
  }

     