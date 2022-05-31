/* Verifica o estados dos Pedidos e Atualiza além de importar os novos */

/* Adicionar importação completa de pedidos ou um estado de pedidos prontos para importação */


var HOST = "http://localhost:3000"

var axios = require('axios');

async function getSupra(){

    var config = {
        method: 'get',
        url: `${HOST}/api/integracoes/supra_erp`
    };
    
    await axios (config)
    .then(async function (response) {
        
        console.log ("dados importados do suprerp!");
        
        var pedidos = response.data

        var pedido

        // console.log("getSupra response.data", pedidos)

        var pedidos_formatados = []

        // console.log("pedidos.length;", pedidos)

        for (let i = 0; i < pedidos.length; i ++){

            // console.log("i < pedidos.length;", i)

            pedido = pedidos[i]

            var items = []
                
            // console.log("pedido.Unidade", pedido.Unidade)

            items.push ({
                ID_produto: parseInt(pedido.ID_produto),
                Descricao: pedido.Descricao, 
                Quantidade: parseInt(parseFloat(pedido.Quantidade)), 
                unidade: pedido.Unidade,
                GTIN: pedido.GTIN,
                Valor_unitario:  parseFloat(pedido.Valor_unitario)
                }
            )



            var transportadora = pedido.Transportadora
            // console.log("pedido.transporte", pedido.Transportadora)

            if (pedido.Transportadora === undefined){
                transportadora = ""
            }

            if (pedido.uf_sigla != null){

                var pedido = {
                
                    ID_pedido: pedido.ID_pedido, 
                    Data: pedido.Data,
                    Nome_do_contato: pedido.Nome_do_contato, 
                    Endereco: pedido.logradouro, 
                    Endereco_Numero: pedido.numero ?? "", 
                    Bairro: pedido.bairro, 
                    Cidade: pedido.cidade, 
                    UF: pedido.uf_sigla, 
                    cep: pedido.cep, 
                    Email: pedido.email, 
                    Telefone: "", 
                    Celular: "", 
                    Situacao: "Pendente", 

                    items: items,

                    // N_NFe: (pedido.nota.numero) , 
                    N_NFe: "", 
                    
                    Transportadora: transportadora, 
                    Loja: "Supra", 
                    Origem: "Supra" 
                }

                pedidos_formatados.push(pedido)
            }
                
            // console.log("Pedido que foi formatado",pedido)

        }



        // return

        // console.log(pedidos_formatados)

        postOrder (pedidos_formatados)

    })
    .catch(async function (error) {
        // console.log(error);
        console.log ("erro ao importar!",error);

    });
    

}

async function postOrder(pedidos){

    console.log("Pedidos aguardando postagem", pedidos.length)
    

    var data = { pedido : pedidos[0]}

    // console.log("Pedido sendo postado: ", data.pedido)
    console.log("Pedido sendo postado: ", data.pedido.ID_pedido)


    for (var i = 0; i < pedidos.length; i++){

        var data = { pedido : pedidos[i]}

        // console.log("Pedido sendo postado: ", data.pedido)
        console.log("Pedido sendo postado: ", i, data.pedido.ID_pedido)

        var config = {
        method: 'post',
        url: `${HOST}/api/cadastro_pedido`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        await axios(config)
        .then(function (response) {
            // console.log("gravado", response.data)
        })
        .catch(function (error) {
            console.log("erro na gravação", i, pedidos.length)
        });

        
        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

        await sleep(10)
    }

}
async function updateOrderState(){

    console.log("Atualizando pedidos!")

    /*BUSCA PEDIDOS JÁ NO WMS*/

    var data = {
        "query": "SELECT ID_pedido, Situacao FROM automate.pedidos WHERE Situacao <> 'Atendido' AND Situacao <> 'Cancelado' AND Origem = 'Supra';"
    };
    
    var resPedidos = (await axios.post(`${HOST}/api/database`, data)).data

    var listPedidos = {}

    for (var prop in resPedidos){
        listPedidos[resPedidos[prop].ID_pedido] = resPedidos[prop].Situacao
    }

    // console.log (resPedidos)

    // return

    await getState(listPedidos)

    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    await sleep(500); // sleep for 10 seconds

    

    console.log("Atualizado!")

    
    /*VERIFICA A SITUAÇÃO ATUAL DE TODOS PEDIDOS*/

    

    /*ESSA FUNÇÃO VERIFICA QUAIS PEDIDOS DEVEM SER ATUALIZADOS NO WMS*/

  
    async function getState(listPedidosWMS){

        var listPedidosBling = {}

        
        // return

        for (var pedido in listPedidosWMS){

            

            var config = {
                method: 'get',
                url: `${HOST}/api/integracoes/supra_erp/?pedido=${pedido}`

            };
            
            var pedidos = (await axios (config)).data

            // console.log("pedidos", pedidos)

            var nf = pedidos[0]['N_NFe'] ?? ""

            // console.log(nf)

            listPedidosBling[pedidos[0].ID_pedido] = [pedidos[0].Situacao, nf]

            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

            await sleep(500);
        }

        // console.log(listPedidosBling)

        var situacaoWMS, situacaoSupra, updateList = {}, nfNum = listPedidosWMS[pedido][0]

        

        for (var pedido in listPedidosWMS){
            situacaoWMS = listPedidosWMS[pedido]

            situacaoSupra = listPedidosBling[pedido][0]
            nfNum = listPedidosBling[pedido][1]

            // console.log(pedido, situacaoWMS, situacaoSupra)

            if (situacaoWMS === "Pendente" && situacaoSupra === "Atendido"){

                if (updateList["Atendido"] === undefined){
                    updateList["Atendido"] = []
                }

                updateList["Atendido"].push(pedido)

            }
    
            else if (situacaoWMS === "Aguardando NF" && situacaoSupra === "Atendido"){
    
                await updateNF(pedido, nfNum)
                
            }

            else if (situacaoWMS === "Pendente" && situacaoSupra === "Cancelado"){

                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
    
            }
            else if (situacaoWMS === "Atendido" && situacaoSupra === "Cancelado"){
    
                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
    
            }
            else if (situacaoWMS === "Em falta" && situacaoSupra === "Em aberto"){
    
                if (updateList["Pendente"] === undefined){
                    updateList["Pendente"] = []
                }

                updateList["Pendente"].push(pedido)
    
            }
            else if (situacaoWMS === "Em falta" && situacaoSupra === "Cancelado"){
                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
            
            }


            // console.log(updateList)
    
        }

        // return

        updateState(updateList)
        
    }


    /*ESSA FUNÇÃO ATUALIZA O ESTADOS DE TODOS PEDIDOS NECESSÁRIOS*/

    async function updateNF(ID_pedido, nfe_num){

        var queries = [
            `UPDATE automate.pedidos SET N_NFe = '${nfe_num}' WHERE (ID_pedido = '${ID_pedido}' and N_NFe='');`
        ]

        // console.log(queries)

        for (var i in queries){
            var data = JSON.stringify({
                "query": queries[i]
            });
            
            var config = {
                method: 'post',
                url: `${HOST}/api/database`,
                headers: { 
                'Content-Type': 'application/json'
                },
                data : data
            };
            
            await axios(config)
            .then(async function (response) {
                // console.log(JSON.stringify(response.data));
            })
            .catch(async function (error) {
                console.log(error);
            });
        
        }
    }

    async function updateState(updateList){

        for (var state in updateList){
            var query = `UPDATE automate.pedidos SET Situacao = '${state}' WHERE ID_pedido in(`

            for (var i in updateList[state]){

                // console.log(i, updateList[state][i])

                query += `'${updateList[state][i]}', `
                

            }

            query += `'0z')`

            // console.log(query)

            var data = {
                "query": query
            }
            
            await axios.post(`${HOST}/api/database`, data)
        }
        
    }

}

async function main(req, res){
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    await updateOrderState()

    await getSupra()

    await sleep(2000);

    res.status(200).send("ok")

    // await main()

     // sleep for 10 seconds

    // await sleep(15000);
    
}

// main()

export default async (req, res) => {
    main(req, res)
    
}

console.log("Fim")