/*
    LIQUIDOS IRÃO SEMPRE EM PÉ
    SACOS POSSUEM UM VOLUME PRÓPRIO
*/

var host = process.env.HOST

export default async function getEmbalagem(req, res) { 

    async function get(){

        return new Promise((resolve, reject) => {
        // console.log("KEYS: ", req.query.id)

        // ####### BUSCA TODOS PEDIDOS EM ABERTO #########
            
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
                    pedidos.id='${req.query.id}'

                INNER JOIN produtos
                ON 
                    pedidos_produtos.ID_produto = produtos.Codigo
                    ;
            `
            
            let data={query : query}


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
                    

                    if (response.status == 200)
                    {

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
                                    listItem["unidade"] =  resp[j].unidade_produto_pedido
                                    listItem["Descricao"] = resp[j].Descricao 
                                    listItem["Localizacao"] = resp[j].Localizacao 
                                    listItem["Largura"] = resp[j].Largura 
                                    listItem["Altura"] = resp[j].Altura 
                                    listItem["Profundidade"] = resp[j].Profundidade 
                                    listItem["Orientacao"] = resp[j].Orientacao 
                                }
                            }
                            listItens.push(listItem)

                            // console.log("listItem", listItem)

                        }


                        // res.status(200).json(listItens)

                        // "Quantidade": 2,
                        // "id": 21,
                        // "ID_produto": "949",
                        // "Descricao": "Lecitina de Soja - 5 Kg",
                        // "Localizacao": "E1-S1-0-A0-P0",
                        // "Largura": "20.00",
                        // "Altura": "34.50",
                        // "Profundidade": "20.00"

                        var pdMedidas = []

                        // console.log("listItens" ,listItens)

                        for (const i in listItens){

                            var medida = [listItens[i].Altura,listItens[i].Largura,listItens[i].Profundidade].sort(function(a, b) {
                                return a - b;
                            })

                            if (listItens[i].Orientacao === "v"){
                                medida = [medida[0], medida[2], medida[1]]
                            }

                            pdMedidas.push({
                                ID_produto : listItens[i].ID_produto,
                                Medida : medida,
                                Quantidade: listItens[i].Quantidade

                            })
                        }

                        // console.log("pdMedidas 1", pdMedidas)

                        // "ID_produto": "1124",
                        // "Medida": [
                        //     "1.00",
                        //     "17.00",
                        //     "21.00"
                        // ]

                        var larguraEquivalente = 0, qntdEquivalente = 0,
                        alturaEquivalente = 0,
                        profundidadeEquivalente = 0

                        // console.log("pdMedidas.length", pdMedidas.length)

                        //"Converte" todos produtos no primeiro item

                        for (var i = 0; i < pdMedidas.length; i ++){

                            larguraEquivalente = pdMedidas[i].Medida[0]/pdMedidas[0].Medida[0]
                            
                            alturaEquivalente = pdMedidas[i].Medida[1]/pdMedidas[0].Medida[1]
                            
                            profundidadeEquivalente = pdMedidas[i].Medida[2]/pdMedidas[0].Medida[2]
                        
                            qntdEquivalente =  qntdEquivalente + (pdMedidas[i].Quantidade * larguraEquivalente * alturaEquivalente * profundidadeEquivalente)
                            
                            // console.log(pdMedidas[i].Quantidade)
                        }
                        

                        var query = `
                            SELECT * FROM automate.embalagens;
                        `
                        
                        let data={query : query}

                        // console.log("INFO: ", data)

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
                                
                                if (response.status == 200)
                                {

                                    var cxMedidas  = []

                                    // "id": 1,
                                    // "Modelo": "N1",
                                    // "Altura": "21.000",
                                    // "Largura": "18.000",
                                    // "Profundidade": "9.000"

                                    for (var i in resp){

                                        cxMedidas.push({
                                            Modelo : resp[i].Modelo,
                                            Medida : [resp[i].Altura,resp[i].Largura,resp[i].Profundidade]
                                        }
                                        )

                                    }

                                    // console.log("pdMedidas", pdMedidas)

                                    var medida1 = 0, medida2 = 0, medida3 = 0, volume = 1, caixas = []

                                    var GerarVolumes = true
                                    while(GerarVolumes){

                                        GerarVolumes = false

                                        // console.log(pdMedidas)

                                        for (var cx in cxMedidas){

                                            
                                            // console.log(pdMedidas[0], cx)
                                            
                                            medida1 = cxMedidas[cx].Medida[0]/pdMedidas[0].Medida[0]

                                            // console.log(cxMedidas[cx].Medida[0], pdMedidas[0].Medida[0], medida1)

                                            medida2 = cxMedidas[cx].Medida[1]/pdMedidas[0].Medida[1]

                                            // console.log(cxMedidas[cx].Medida[1], pdMedidas[0].Medida[1], medida2)

                                            medida3 = cxMedidas[cx].Medida[2]/pdMedidas[0].Medida[2]

                                            // console.log(cxMedidas[cx].Medida[1], pdMedidas[0].Medida[1], medida3)
                                            
                                            // console.log([pdMedidas, medida1*medida2*medida3, qntdEquivalente, cxMedidas[cx].Modelo])

                                            // console.log([pdMedidas, medida1*medida2*medida3, qntdEquivalente, cxMedidas[cx].Modelo, volume])

                                            // console.log(`${cxMedidas[cx].Medida[0]}/${pdMedidas[0].Medida[1]}`, cxMedidas[cx].Medida[0]/pdMedidas[0].Medida[1])

                                            if (medida1*medida2*medida3 >= qntdEquivalente && cxMedidas[cx].Medida[0]/pdMedidas[0].Medida[1] >= 1){

                                                caixas.push(cxMedidas[cx].Modelo)

                                                res.status(200).json([pdMedidas, {Modelo: caixas, Volume: volume}])
                                                return
                                            }

                                            else if (cxMedidas.indexOf(cxMedidas[cx]) === cxMedidas.length-1){


                                                // res.status(200).json([pdMedidas, {Modelo: "Não definido"}])

                                                if (medida1*medida2*medida3 < qntdEquivalente){
                                                    caixas.push(cxMedidas[cx].Modelo)
                                                    qntdEquivalente = qntdEquivalente - medida1*medida2*medida3
                                                    volume ++
                                                }
                                                // else{
                                                    
                                                // }

                                            }
                                                
                                        }
                                    }

                                    caixas.push("Não definido")

                                    // console.log(caixas)

                                    res.status(200).json([pdMedidas, {Modelo: caixas, Volume: volume}])
                                    
                                    resolve()

                                }
                                
                            } 
                                    
                            )
                        )

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

     