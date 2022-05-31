import axios from "axios"

const HOST = process.env.HOST

export default async function(req, res) {


    // setTimeout(() => {res.write('Hello World'); res.end()}, 5000)

    /* Total de Envios
        dos romaneios postados hoje quero saber quais pedidos tem status atendido
        
        1 - Quais romaneios foram postados hoje?
            SELECT 
                id
            FROM romaneios
            where DATE(NOW())-1 = DATE(romaneios.created_date) order by 1 desc

        2 - Quantidades de STATUS?
            SELECT 
                pedidos.ID_pedido as numero_pedido, 
                pedidos.data as data_pedido, 
                pedidos.modified_date as data_alteracao,
                pedidos.Loja as loja, 
                pedidos.Transportadora as transportadora, 
                pedidos.Origem as origem,
                pedidos.Situacao as situacao,
                romaneios.id, 
                romaneios.created_date as data_romaneio

            FROM automate.pedidos 
            inner join romaneios
            on	
                pedidos.romaneio = romaneios.id 

            where  origem = '${origem}' and DATE(NOW()) = DATE(romaneios.created_date) order by 1 desc

        Outra coisa a se obervar é o tempo de separação dos pedidos, ele pode ser medido a partir do tempo decorrido entre 
        a geração do romaneio até o momento que o primeiro pedido foi verificado no checkout.

        3 - Tempo de separação dos pedidos
            SELECT 
                pedidos.ID_pedido as numero_pedido, 
                pedidos.data as data_pedido, 
                pedidos.modified_date as data_alteracao,
                pedidos.Loja as loja, 
                pedidos.Transportadora as transportadora, 
                pedidos.Origem as origem,
                pedidos.Situacao as situacao,
                romaneios.id, 
                romaneios.created_date as data_romaneio,
                timediff(pedidos.modified_date, romaneios.created_date) tempo_decorrido
            FROM automate.pedidos 
            inner join romaneios
            on	
                pedidos.romaneio = romaneios.id 

            where  origem = '${origem}' and DATE(NOW()) = DATE(romaneios.created_date) order by tempo_decorrido
    */
    async function get(origem) {
        var query_qntd_romaneios = `
            SELECT 
                id
            FROM romaneios
            where DATE(NOW()) = DATE(romaneios.created_date) order by 1 desc`

        var query_qntd_pedidos_situacoes = `
            SELECT 
                pedidos.ID_pedido as numero_pedido, 
                pedidos.data as data_pedido, 
                pedidos.modified_date as data_alteracao,
                pedidos.Loja as loja, 
                pedidos.Transportadora as transportadora, 
                pedidos.Origem as origem,
                pedidos.Situacao as situacao,
                romaneios.id, 
                romaneios.created_date as data_romaneio,
                timediff(pedidos.modified_date, romaneios.created_date) as tempo_decorrido
            FROM automate.pedidos 
            inner join romaneios
            on	
                pedidos.romaneio = romaneios.id 

            where  origem = '${origem}' and DATE(NOW()) = DATE(romaneios.created_date) or situacao='Em falta' order by tempo_decorrido
            `

        var query_qntd_pedidos_pendentes = `
            SELECT 
                pedidos.ID_pedido as numero_pedido,
                pedidos.Transportadora as transportadora,
                pedidos.Situacao as situacao
            FROM automate.pedidos 
            where  
                origem = '${origem}' and 
                Situacao= 'Pendente' and not
                ( Transportadora = 'Sem Transporte' and Loja = 'Tray') and not 
                ( Transportadora = '' and Loja = 'Tray')
            order by 1 desc`

        
        var qntd_romaneios = (await axios.post(`${HOST}/api/database`, {query: query_qntd_romaneios})).data
        var qntd_pedidos_situacoes = (await axios.post(`${HOST}/api/database`, {query: query_qntd_pedidos_situacoes})).data
        var qntd_pedidos_pendentes = (await axios.post(`${HOST}/api/database`, {query: query_qntd_pedidos_pendentes})).data

        var qntd_pedidos_situacoes_atendidos = qntd_pedidos_situacoes.filter(pedido => pedido.situacao == 'Atendido')
        var qntd_pedidos_situacoes_separando = qntd_pedidos_situacoes.filter(pedido => pedido.situacao == 'Em separação')
        var qntd_pedidos_situacoes_faltando = qntd_pedidos_situacoes.filter(pedido => pedido.situacao == 'Em falta')
        var qntd_pedidos_situacoes_aguardando_nf = qntd_pedidos_situacoes.filter(pedido => pedido.situacao == 'Aguardando NF')

        
        var transportadoras = {}
        transportadoras[origem] = {}

        for (var i in qntd_pedidos_situacoes){

            if(transportadoras[origem][qntd_pedidos_situacoes[i].transportadora] === undefined){
                transportadoras[origem][qntd_pedidos_situacoes[i].transportadora] = 1
            }
            else{
                transportadoras[origem][qntd_pedidos_situacoes[i].transportadora] = transportadoras[origem][qntd_pedidos_situacoes[i].transportadora] + 1
            }
        }
        
        for (var i in qntd_pedidos_pendentes){

            if(transportadoras[origem][qntd_pedidos_pendentes[i].transportadora] === undefined){
                transportadoras[origem][qntd_pedidos_pendentes[i].transportadora] = 1
            }
            else{
                transportadoras[origem][qntd_pedidos_pendentes[i].transportadora] = transportadoras[origem][qntd_pedidos_pendentes[i].transportadora] + 1
            }
        }

        // console.log(transportadoras[origem])

        return {
            qntd_romaneios: qntd_romaneios,
            qntd_pedidos_situacoes_atendidos: qntd_pedidos_situacoes_atendidos,
            qntd_pedidos_situacoes_separando: qntd_pedidos_situacoes_separando,
            qntd_pedidos_situacoes_faltando: qntd_pedidos_situacoes_faltando,
            qntd_pedidos_situacoes_aguardando_nf: qntd_pedidos_situacoes_aguardando_nf,
            qntd_pedidos_pendentes: qntd_pedidos_pendentes,
            qtnd_transportadoras: transportadoras[origem]
        }
    }

    res.setHeader('Content-Type', 'application/json');

    var Bling = await get("Bling")
    var Supra = await get("Supra")

    // console.log(Bling)

    var resultado ={ 
        bling: {
            'qntd_romaneios.length' : Bling.qntd_romaneios.length,
            'qntd_pedidos_situacoes_atendidos.length' : Bling.qntd_pedidos_situacoes_atendidos.length,
            'qntd_pedidos_situacoes_separando.length' : Bling.qntd_pedidos_situacoes_separando.length,
            'qntd_pedidos_situacoes_aguardando_nf.length' : Bling.qntd_pedidos_situacoes_aguardando_nf.length,
            'qntd_pedidos_situacoes_faltando.length' : Bling.qntd_pedidos_situacoes_faltando.length,
            'qntd_pedidos_pendentes.length' : Bling.qntd_pedidos_pendentes.length,
            'qtnd_transportadoras' : Bling.qtnd_transportadoras
            
            
        },
        supra:{
            'qntd_romaneios.length' : Supra.qntd_romaneios.length,
            'qntd_pedidos_situacoes_atendidos.length' : Supra.qntd_pedidos_situacoes_atendidos.length,
            'qntd_pedidos_situacoes_separando.length' : Supra.qntd_pedidos_situacoes_separando.length,
            'qntd_pedidos_situacoes_aguardando_nf.length' : Supra.qntd_pedidos_situacoes_aguardando_nf.length,
            'qntd_pedidos_situacoes_faltando.length' : Supra.qntd_pedidos_situacoes_faltando.length,
            'qntd_pedidos_pendentes.length' : Supra.qntd_pedidos_pendentes.length,
            'qtnd_transportadoras' : Supra.qtnd_transportadoras
        }
    }

    res.status(200).json(resultado)

}