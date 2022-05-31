
const request = require('request')
const decompress = require('decompress');
const axios = require('axios');

const fs = require('fs');
const xml2js = require('xml2js');

const apikey = "2e9551b0e6982c3597e9b534ffa1af9ee43d243c0842eda76d370b2a1c37374c2d58bc0a"

const HOST = process.env.HOST

var _TODAY = new Date();
_TODAY = _TODAY.getFullYear() + "-" + (_TODAY.getMonth() + 1) + "-" + _TODAY.getDate();

var _DATA = new Date();


var _dia = `${_DATA.getDate()}`.padStart(2, '0')
var _mes = `${(_DATA.getMonth() + 1)}`.padStart(2, '0')
var _ano = `${_DATA.getFullYear()}`.padStart(2, '0')

_DATA = `${_dia}/${_mes}/${_ano}`

console.log(_TODAY)

// _TODAY = "2022-05-23"


export default async function PedidoRet(req, res){

    var axios = require('axios');

    var config = {
    method: 'get',
    url: 'http://localhost:3000/api/integracoes/bling/login_bling',
    headers: { }
    };

    await axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });


   
    async function GetOriginByID(id){

        
        var axios = require('axios')

        var query = `
        
            SELECT 
                [codigo],
                [nome],
                [preco_venda],
                [preco_custo],
                [quantidade_estoque],
                [id_origem]
            FROM produto where codigo = ${id}`

        console.log(query)


        let data={query : query}

        var response = (await axios.post(`${HOST}/api/integracoes/supra_erp/database`, data)).data

        console.log(response.recordset[0].codigo)

        await new Promise((resolve, reject) =>{ setTimeout(resolve, 500) })

        return response.recordset[0]

    }


    async function NotasFiscaisByDay(){    
        
        var config = {
            method: 'get',
            url: `https://bling.com.br/Api/v2/notasfiscais/json/?filters=dataEmissao[${_DATA} 00:01:00 TO ${_DATA} 23:59:59]; situacao[7]&apikey=${apikey}`,
        };

        await axios(config)
        .then(async function (response) {
        console.log(JSON.stringify(response.data));

            var nfList = response.data["retorno"]["notasfiscais"]

            var idList = []

            for (var i in nfList){
                idList.push(nfList[i].notafiscal.id)
            }

            console.log(idList)


            await getXMLById(idList)

            // res.status(200).json({"response": idList, size: idList.length})
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    async function getXMLById(idListNF){

        var axios = require('axios');
     
        var config = {
          method: 'get',
          url: `${HOST}/api/integracoes/bling/session`,
        };
      
        var AUTH = (await axios(config)).data
        
        const PHPSESSID = AUTH.PHPSESSID
        const PCSID = AUTH.PCSID
        
        var headers = {
            'authority': 'www.bling.com.br',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            'content-type': 'application/x-www-form-urlencoded',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
            'session-token': PHPSESSID,
            'sec-ch-ua-platform': '"Windows"',
            'accept': '*/*',
            'origin': 'https://www.bling.com.br',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.bling.com.br/notas.fiscais.old.php',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': `_fbp=fb.2.1639168075700.770256098; _gcl_au=1.1.451156857.1639168075; initial_referer=%2F; leitorCodigoBarrasConferencia=undefined; _gid=GA1.3.1135925210.1646047199; avisoVisualizado=1646145620; _clck=dms5j1|1|ezg|0; __zlcmid=18okkQx5tBDmdm5; _uetsid=d3108fa09ae211ecb04a0319877b6cd2; _uetvid=a87e4e5059f711ecaefc43ec20c67f9c; _gat_UA-33625932-1=1; _clsk=1cf8wu6|1646318033719|2|0|d.clarity.ms/collect; _gali=login-buttons-site; PHPSESSID=${PHPSESSID}; PCSID=${PCSID}; _ga_3QBHN0MFWR=GS1.1.1646317741.60.1.1646318035.56; _ga=GA1.3.610427492.1639168075; _gat=1; mp_89dc10374c4e80cb7322ffa49d0220cf_mixpanel=%7B%22distinct_id%22%3A%20%226187741327%22%2C%22%24device_id%22%3A%20%2217da60816dfc2a-0959aec4d3c5a3-978153c-1fa400-17da60816e096c%22%2C%22%24user_id%22%3A%20%226187741327%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.bling.com.br%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.bling.com.br%22%7D`
        };

        var querySearch = ""

        var elementID, nfID

        for (var i = 0; i < idListNF.length; i ++){

            elementID = idListNF[i]
            nfID= i +1

            querySearch += `<e><k>${nfID}</k><v>${elementID}</v></e>`
        }


        var dataString = `xajax=gerarArquivoXMLNFes&xajaxargs[]=<xjxobj>${querySearch}</xjxobj>&xajaxargs[]=`;

        var options = {
            url: 'https://www.bling.com.br/services/notas.fiscais.server.php?f=gerarArquivoXMLNFes',
            method: 'POST',
            headers: headers,
            body: dataString
        };
        
        async function callback(error, response, body) {

            console.log(body)

            if (!error && response.statusCode == 200) {

                var responseJson = JSON.parse(body)

                console.log(responseJson.dir + responseJson.filename)
                
                var URL = responseJson.dir + responseJson.filename

                await getXMLFiles(URL)

                /*NESTE PONTO JÁ RECEBEMOS TODO XML A PARTIR DE UMA LISTA*/
                /*AGORA PRECISAMOS TRATAR O ARQUIVO ZIP -> XML -> RETIRAR ITENS*/
            }
            else {
                res.status(500).json({"response": "error", "error": error})
                // console.log("getXMLById(idListNF)")
            }

        }
        
        request(options, callback);

        
    }


    async function getXMLFiles(URL){ 
        var config = {
            method: 'get',
            url: URL,
            headers: { },
            responseType: 'arraybuffer'
        };
        
        await axios(config)
        .then(async function (response) {
            await readFileDownloaded(response.data)
        })
        .catch(function (error) {
        console.log(error);
        });
    }

    async function readFileDownloaded(data){

        fs.writeFile(`src/dist/xml/${_TODAY}.zip`, data,  "binary", async function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
            await descompressFile()
        }
    });
    }

    async function descompressFile(){
            try{
                fs.mkdirSync(`src/dist/xml/${_TODAY}`)
            }
            catch{
                console.log("descompressFile() Erro ao criar pasta")
            }
            await decompress(`src/dist/xml/${_TODAY}.zip` , `src/dist/xml/${_TODAY}`).then(async function(files){
            console.log('descompress done!', );
        
        })
    }

    async function main(origem, origemNome){

        var xmlList = fs.readdirSync(`src/dist/xml/${_TODAY}`)

        console.log(" xmlList",xmlList)

        
        var lista = {}

        for (var j=0; j < xmlList.length; j ++){
            var fileBuffer = fs.readFileSync(`src/dist/xml/${_TODAY}/` + xmlList[j], "utf-8")

            console.log(`src/dist/xml/${_TODAY}/` + xmlList[j])
        
            var parser = new xml2js.Parser();

            var result = await parser.parseStringPromise(fileBuffer)

            var NFNum = result.nfeProc.NFe[0].infNFe[0].ide[0].nNF[0]

            var NFitem = result.nfeProc.NFe[0].infNFe[0].det[0].prod[0]

            [
                {
                    cProd: [ '1037' ],
                    cEAN: [ '7898329371993' ],
                    xProd: [ 'Alho em Po Adicel - 500G' ],
                    NCM: [ '07129010' ],
                    CEST: [ '1710100' ],
                    indEscala: [ 'S' ],
                    CFOP: [ '5102' ],
                    uCom: [ 'PCT' ],
                    qCom: [ '2.0000' ],
                    vUnCom: [ '23.95' ],
                    vProd: [ '47.90' ],
                    cEANTrib: [ '7898329371993' ],
                    uTrib: [ 'PCT' ],
                    qTrib: [ '2.0000' ],
                    vUnTrib: [ '23.95' ],
                    vFrete: [ '3.46' ],
                    vDesc: [ '0.48' ],
                    indTot: [ '1' ],
                    nItemPed: [ '1' ]
                }
            ]

            for (var i = 0; i < result.nfeProc.NFe[0].infNFe[0].det.length; i ++){
                var codigo = result.nfeProc.NFe[0].infNFe[0].det[i].prod[0].cProd[0]

                codigo = parseInt(codigo) 

                console.log("codigo", codigo)

                // codigo = xml2js.parseString(codigo)

                var produto = (await GetOriginByID(codigo))

                var cod_origem = produto.id_origem

                async function Constrution(){
                    var descricao = result.nfeProc.NFe[0].infNFe[0].det[i].prod[0].xProd[0]
                    var unidade = result.nfeProc.NFe[0].infNFe[0].det[i].prod[0].uCom[0]
                    var quantidade = parseFloat(result.nfeProc.NFe[0].infNFe[0].det[i].prod[0].qCom[0])
                    // var valor = parseInt(result.nfeProc.NFe[0].infNFe[0].det[i].prod[0].vUnCom[0]*100)/100
                    // var valor = (await GetRealPrice(codigo)).realPrice
                    var valor = produto.preco_custo
                    var valorTotal = parseInt(quantidade*valor*100)/100
        
                    console.log("Constrution()", codigo, descricao, valor)
        
                    try{
                        lista[codigo][0] = lista[codigo][0] + quantidade
                        lista[codigo][1] = valor 
                        // lista[codigo][1] = lista[codigo][1] + valorTotal
                    }
                    catch{
                        // lista[codigo] = [quantidade, valorTotal, descricao, codigo, unidade]
                        lista[codigo] = [quantidade, valor, descricao, codigo, unidade]
        
                    }
                }

                console.log("cod_origem", cod_origem)
                
                if (origem.indexOf(cod_origem) != -1){

                    // console.log("origem.indexOf(cod_origem)", origem.indexOf(cod_origem))
                    await Constrution()
                }

            }
            
            var qntdItensUnicos = Object.keys(lista).length

            // console.log(lista, qntdItensUnicos);
            // console.log("done! xmlList.length", j);
        }

        var itens = ""

        console.log(lista)

        for (var i in lista){

            var quantidade = lista[i][0]
            var valor = lista[i][1]
            var descricao = lista[i][2]
            var codigo = lista[i][3]
            var unidade = lista[i][4]

            itens +=
            `<item>
            <codigo>${codigo}</codigo>
            <descricao>${descricao}</descricao>
            <un>${unidade}</un>
            <qtde>${quantidade}</qtde>
            <vlr_unit>${valor}</vlr_unit>
            </item>
            `
        }

        var xmlPedido = `<?xml version="1.0" encoding="UTF-8"?>
        <pedido>
        <cliente>
        <nome>Pedido RET</nome>
        <tipoPessoa>J</tipoPessoa>
        <endereco>R. Boaventura</endereco>
        <cpf_cnpj>01957839000266</cpf_cnpj>
        <ie>3067663000</ie>
        <numero>1960</numero>
        <complemento>Galpão Adicel</complemento>
        <bairro>Liberdade</bairro>
        <cep>31270-310</cep>
        <cidade>Belo Horizonte</cidade>
        <uf>MG</uf>
        <fone>3134253999</fone>
        <email>automacao@adicel.com.br</email>
        </cliente>
        <itens>

        ${itens}
        
        </itens>
        <obs>Pedido RET dia ${_TODAY} ${origemNome}</obs>
        <obs_internas>Pedido RET dia ${_TODAY} ${origemNome}</obs_internas>
        </pedido>`


        // res.status(200).json(xmlPedido)


        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'apikey': `${apikey}`,
        'xml': xmlPedido 
        });
        var config = {
        method: 'post',
        url: 'https://bling.com.br/Api/v2/pedido/json/',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        console.log("qntdItensUnicos", qntdItensUnicos)

        // res.status(200).json({
        //     response: lista        
        // })


        await axios(config)
        .then(function (response) {
            console.log(response.data);
            res.status(200).json({response: response.data})
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({error: error})
        });

    }

    async function updateProduct(id, res){

        var produto = (await GetOriginByID(id))

        var data = {
            'apikey': `${apikey}`,
            'xml': `<?xml version="1.0" encoding="utf-8"?>
            <produto>
                <vlr_unit>${produto.preco_venda}</vlr_unit>
                <preco_custo>${produto.preco_custo}</preco_custo>
                <estoque>${produto.quantidade_estoque}</estoque>
            </produto>
            `
        }
        
        var qs = require('qs');
        var data = qs.stringify(data);
        var config = {
        method: 'post',
        url: `https://bling.com.br/Api/v2/produto/${id}/json/`,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        await axios(config)
        .then(function (response) {
            console.log(response.data);
            // res.status(200).json({response: response.data})
        })
        .catch(function (error) {
            console.log(error);
            // console.log({error: error})
        });

    }

    
    var origem

    /*
        *1 - Nacional
        -2 - Estrangeira - Importação direta
        -3 - Estrangeira - Adquirida no mercado interno
        *4 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40%
        *6 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
    */
   
    var origemNome = req.body.origem

    console.log("req.query.origem", req.data)

    

    await NotasFiscaisByDay()

    await updateProduct('949', res)
    await updateProduct('951', res)
    await updateProduct('676', res)
    
    
    if (origemNome === "nacional"){
        origem = [1, 4, 6]

        await main(origem, origemNome)
    }
    else if (origemNome === "importado"){
        origem = [2, 3]

        await main(origem, origemNome)
    }
    else{
        res.end("Origem inválida")
    }

    

}