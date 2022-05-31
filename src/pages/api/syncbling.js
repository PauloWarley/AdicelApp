/* Verifica o estados dos Pedidos e Atualiza além de importar os novos */

/* Adicionar importação completa de pedidos ou um estado de pedidos prontos para importação */


var HOST = process.env.HOST

const axios = require('axios');
// const delay = require('delay');

async function getBling(){

    var config = {
        method: 'get',
        url: `${HOST}/api/integracoes/bling`
    };
    
    await axios (config)
    .then(async function (response) {
        
        console.log ("dados importados do bling!");
        // console.log (response.data);
        
        // var pedidos = response.data
        var pedidos = response.data

        // console.log(pedidos)

        var pedido

        var pedidos_formatados = []

        // for (let i = 0; i < 1; i ++){
        for (let i = 0; i < pedidos.length; i ++){

            pedido = pedidos[i].pedido

            // console.log(pedido.numero)

            // console.log(Object.keys(pedido))
            // console.log(pedido.desconto)
            
            var items = []
                
            for (let i = 0; i < pedido.itens.length; i ++){
                var item = pedido.itens[i].item

                // console.log(item)

                items.push ({
                    ID_produto: item.codigo,
                    Descricao: item.descricao, 
                    Quantidade: parseInt(parseFloat(item.quantidade)), 
                    unidade: item.un,
                    GTIN: item.gtin,
                    Valor_unitario:  parseFloat(item.valorunidade), 
                    
                }
                )


            }

            var transportadora 
            // console.log("pedido.transporte", pedido.transporte)
            // console.log(pedido.transporte.servico, pedido.transporte.transportadora)
            if (pedido.transporte === undefined){
                transportadora = ""
            }
            else if (pedido.transporte.servico === undefined && pedido.transporte.transportadora === undefined){
                transportadora = ""
            }
            else if (pedido.transporte.servico != undefined){
                transportadora = pedido.transporte.servico 
            }
            else if (pedido.transporte.transportadora != undefined){
                transportadora = pedido.transporte.transportadora 
            }

            if (pedido.cliente.uf != null){

                var pedido = {
                
                    ID_pedido: pedido.numero, 
                    Data: pedido.data,
                    Nome_do_contato: pedido.cliente.nome, 
                    Endereco: pedido.cliente.endereco, 
                    Endereco_Numero: pedido.cliente.numero ?? "", 
                    Bairro: pedido.cliente.bairro, 
                    Cidade: pedido.cliente.cidade, 
                    UF: pedido.cliente.uf, 
                    Email: pedido.cliente.email, 
                    Telefone: pedido.cliente.telefone ?? "", 
                    Celular: pedido.cliente.fone ?? "", 
                    Situacao: "Pendente", 

                    items: items,

                    // N_NFe: (pedido.nota.numero) , 
                    N_NFe:  "", 
                    
                    Transportadora: transportadora, 
                    Loja: pedido.tipoIntegracao, 
                    Origem: "Bling" 
                }

                pedidos_formatados.push(pedido)
            }
                
            // console.log("Pedido que foi formatado",pedido.ID_pedido)

        }


        // console.log(pedidos_formatados)

        await postOrder (pedidos_formatados)

    })
    .catch(async function (error) {
        // console.log(error);
        console.log ("erro ao importar!",error);

    });
    

}

async function postOrder(pedidos){


    // console.log("Pedidos aguardando postagem",pedidos)

    // for (let i = 0; i < pedidos.length; i++){
    for (let i = 0; i < pedidos.length; i++){

        // console.log("Pedido sendo postado: ", pedidos[i].ID_pedido)

        var data = { pedido : pedidos[i]}

        await axios.post(`${HOST}/api/cadastro_pedido`, data)
            .then(function (response) {
            // console.log(response.data);
            // console.log ("gravado");
            // console.log(i, pedidos.length)
            })
            .catch(function (error) {
            // console.log(error);
            console.log ("erro na gravação");
            console.log(i, pedidos.length)
            });
        
        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

        await sleep(10);
    }



}

async function updateOrderState(){

    console.log("Atualizando pedidos!")

    /*BUSCA PEDIDOS JÁ NO WMS*/

    var data = {
        "query": "SELECT ID_pedido, Situacao FROM automate.pedidos WHERE Situacao <> 'Atendido' AND Situacao <> 'Cancelado' AND Origem = 'Bling';"
    };
    
    var resPedidos = (await axios.post(`${HOST}/api/database`, data)).data

    var listPedidos = {}

    for (var prop in resPedidos){
        listPedidos[resPedidos[prop].ID_pedido] = resPedidos[prop].Situacao
    }

    await getState(listPedidos)

    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    await sleep(500); // sleep for 10 seconds

    

    console.log("Atualizado!")

    
    /*VERIFICA A SITUAÇÃO ATUAL DE TODOS PEDIDOS*/

    

    /*ESSA FUNÇÃO VERIFICA QUAIS PEDIDOS DEVEM SER ATUALIZADOS NO WMS*/

  
    async function getState(listPedidosWMS){

        var listPedidosBling = {}

        for (var pedido in listPedidosWMS){

            var config = {
                method: 'get',
                url: `${HOST}/api/integracoes/bling/?pedido=${pedido}`

            };
            
            var pedidos = (await axios (config)).data

            var nf = pedidos[0]['pedido']['nota'] ?? ""

            listPedidosBling[pedidos[0].pedido.numero] = [pedidos[0].pedido.situacao, ]

            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

            await sleep(500);
        }

        console.log(listPedidosBling)

        var situacaoWMS, situacaoBling, updateList = {}

        

        for (var pedido in listPedidosWMS){
            situacaoWMS = listPedidosWMS[pedido]
            situacaoBling = listPedidosBling[pedido]

            console.log(pedido, situacaoWMS, situacaoBling)

            if (situacaoWMS === "Pendente" && situacaoBling === "Atendido"){

                if (updateList["Atendido"] === undefined){
                    updateList["Atendido"] = []
                }

                updateList["Atendido"].push(pedido)

            }
    
            else if (situacaoWMS === "Pendente" && situacaoBling === "Em separação"){
    
                if (updateList["Em separação"] === undefined){
                    updateList["Em separação"] = []
                }

                updateList["Em separação"].push(pedido)
    
            }

            else if (situacaoWMS === "Em separação" && situacaoBling === "Aguardando NF"){
    
                if (updateList["Aguardando NF"] === undefined){
                    updateList["Aguardando NF"] = []
                }

                updateList["Aguardando NF"].push(pedido)
    
            }
    
            else if (situacaoWMS === "Aguardando NF" && situacaoBling === "Atendido"){
    
                await updateNF(pedido, parseInt(pedidos[0]['pedido']['nota']['numero']) )
    
            }
            else if (situacaoWMS === "Pendente" && situacaoBling === "Cancelado"){

                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
    
            }
            else if (situacaoWMS === "Atendido" && situacaoBling === "Cancelado"){
    
                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
    
            }
            else if (situacaoWMS === "Em falta" && situacaoBling === "Em aberto"){
    
                if (updateList["Pendente"] === undefined){
                    updateList["Pendente"] = []
                }

                updateList["Pendente"].push(pedido)
    
            }
            else if (situacaoWMS === "Em falta" && situacaoBling === "Cancelado"){
                if (updateList["Cancelado"] === undefined){
                    updateList["Cancelado"] = []
                }

                updateList["Cancelado"].push(pedido)
            
            }

            else if (situacaoWMS === "Em falta" && situacaoBling === "Em digitação"){
                if (updateList["Em digitação"] === undefined){
                    updateList["Em digitação"] = []
                }

                updateList["Em digitação"].push(pedido)
            
            }
            else if (situacaoWMS === "Pendente" && situacaoBling === "Em digitação"){
                if (updateList["Em digitação"] === undefined){
                    updateList["Em digitação"] = []
                }

                updateList["Em digitação"].push(pedido)
            
            }

            // console.log(updateList)
    
        }

        updateState(updateList)
        
    }


    /*ESSA FUNÇÃO ATUALIZA O ESTADOS DE TODOS PEDIDOS NECESSÁRIOS*/

    async function updateNF(ID_pedido, nfe_num){

        var queries = [
            `UPDATE automate.pedidos SET N_NFe = '${nfe_num}' WHERE (ID_pedido = '${ID_pedido}');`
        ]


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

                console.log(i, updateList[state][i])

                query += `'${updateList[state][i]}', `
                

            }

            query += `'0z')`

            console.log(query)

            var data = {
                "query": query
            }
            
            await axios.post(`${HOST}/api/database`, data)
        }
        
    }

}

async function main(req, res){

    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    var time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

    console.log("tempo gasto: ", time)

    await updateOrderState()

    await sleep(2000); // sleep for 10 seconds

    await getBling()

    // await main()     
    
    res.status(200).send("ok")

}


export default async (req, res) => {
    main(req, res)
    
}
// main()
