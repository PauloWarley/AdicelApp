import axios from "axios";
import request from "request";

var APIKEY = "2e9551b0e6982c3597e9b534ffa1af9ee43d243c0842eda76d370b2a1c37374c2d58bc0a"


// id: 6,
// idHerdado: 0,
// nome: Em aberto,
// cor: #E9DC40

// id: 9,
// idHerdado: 0,
// nome: Atendido,
// cor: #3FB57A

// id: 12,
// idHerdado: 0,
// nome: Cancelado,
// cor: #CBCBCB

// id: 15,
// idHerdado: 0,
// nome: Em andamento,
// cor: #0065F9

// id: 18,
// idHerdado: 0,
// nome: Venda Agenciada,
// cor: #FF7835

// id: 21,
// idHerdado: 0,
// nome: Em digitação,
// cor: #FF66E3

// id: 24,
// idHerdado: 0,
// nome: Verificado,
// cor: #85F39E

// id: 48047,
// idHerdado: 15,
// nome: Em separação,
// cor: #44e8fd

// id: 49012,
// idHerdado: 15,
// nome: Em falta,
// cor: #b63e3e

// id: 51976,
// idHerdado: 15,
// nome: Aguardando NF,
// cor: #188170


export default async function bling(req, res){

    async function getPedidos(req, res){

        let data_inicio = "31/12/2010"
        let data_final = "31/10/2051"
        let page = 1
        let situacao = 6

        /*SITUAÇÃO ESPECIAL*/
        // let situacao = 21



        let cod_pedido = ""
        let query_pedido = ""
        let query_pedidos = ""

        let modo = "pedidos"

        if (req.query.pedido != undefined){

            modo = "pedido"

            cod_pedido = req.query.pedido

        }
        
       

        switch (modo){
         
            case "pedidos":    

                query_pedidos = `pedidos/page=${page}/json/?apikey=${APIKEY}&filters=idSituacao[${situacao}]; dataEmissao[${data_inicio} TO ${data_final}]`
                query_pedido = ""
                break

            case "pedido":

                query_pedido = `pedido/${cod_pedido}/json/?apikey=${APIKEY}`
                query_pedidos = ""
                break

        }

        // dataEmissao
        // dataAlteracao
        // dataPrevista

        var config = {
            method: 'get',
            url: `https://bling.com.br/Api/v2/${query_pedidos}${query_pedido}`
        };


        return new Promise((resolve, reject) => {
            axios(config)
            .then(function (response) {
                res.status(200).json (response.data["retorno"]["pedidos"]);
                resolve()
            })
            .catch(function (error) {

                resolve()
            });
        })
        
        
          
    }

    async function putPedido(req, res){

        // console.log(req.body)

        var idPedido = req.body.idPedido ?? 0
        // idPedido = ""
        var idSituacao = req.body.idSituacao ?? "x"
        

        var xml = `<?xml version="1.0" encoding="UTF-8"?>
                        <pedido>
                            <idSituacao>${idSituacao}</idSituacao>
                        </pedido>`

        var config = {
          method: 'put',
          url: `https://bling.com.br/Api/v2/pedido/${idPedido}/json/?apikey=${APIKEY}&xml=${xml}`
        };
        
        return new Promise((resolve, reject) => {
            axios(config)
            .then(async function (response) {
                await res.status(200).json(JSON.stringify(response.data["retorno"]))

                resolve()
            })
            .catch(async function (error) {
                await res.status(400).end()
                resolve()
            });
        })
          
    }

 

    if (req.method === "GET"){
        await getPedidos(req, res)
        
    }
    if (req.method === "PUT"){

        await putPedido(req, res)

    }


}