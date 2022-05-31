const HOST = process.env.HOST

const decompress = require('decompress');
const fs = require('fs');
const xml2js = require('xml2js');

var request = require('request');

export default async function getTag(req, res){

    var idOrder = req.query.id

    var logistic = req.query.logistic

    console.log(idOrder, logistic)

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
    

    if (logistic === "ECT - Empresa Brasileira de Correios e TelégrafosTray" || logistic === "ECT - Empresa Brasileira de Correios e TelégrafosAmazon" || logistic === "ECT - Empresa Brasileira de Correios e TelégrafosCarrefour"){
        console.log(logistic)
        getTagCorreios()
    }
    else if(logistic === "Mandaê Serviço de Consultoria de LogísticaTray"){
        console.log(logistic)
        getTagMandae()
    }
    else if(logistic === "ECT - Empresa Brasileira de Correios e TelégrafosSkyHub"){
        console.log(logistic)
        getNfTagB2W()
    }
    else if(logistic === "ECT - Empresa Brasileira de Correios e TelégrafosIntegraCommerce"){
        console.log(logistic)
        getTagMagaLu()
    }
    else if(logistic === "Sem TransporteMercadoLivre" || logistic === "MercadoLivre"){
        console.log(logistic)
        getTagMercadoLivre()
    }
    else if(logistic === "ViaVarejo"){
        console.log(logistic)
        getTagViaVarejo()
    }
    else if (logistic === undefined){
        res.status(200).json("Not found")
    }

    async function getTagCorreios(){
        var request = require('request');
        
        // var dataString = `xajax=listarObjetos&xajaxs=&xajaxr=1644587692850&xajaxargs[]=%3Cxjxobj%3E%3Ce%3E%3Ck%3Epesquisa%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Eordenar%3C%2Fk%3E%3Cv%3ED%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Esituacao%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EsituacaoObjeto%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqSituacaoPedido%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqMultiloja%3C%2Fk%3E%3Cv%3E0%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqNPedidoLV%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqRemessa%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqEstado%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqTipoLog%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqNPedidoPlp%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EfiltroDinamico%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Epagina%3C%2Fk%3E%3Cv%3E1%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EnomeIntegracao%3C%2Fk%3E%3Cv%3E73848%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataIni%3C%2Fk%3E%3Cv%3E12%2F01%2F2022%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataFim%3C%2Fk%3E%3Cv%3E11%2F02%2F2022%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Eperiodo%3C%2Fk%3E%3Cv%3Eult30%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EperiodoPeriod%3C%2Fk%3E%3Cv%3EPer%C3%ADodo%20customizado%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataOpc%3C%2Fk%3E%3Cv%3Edata%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Ecriterio%3C%2Fk%3E%3Cv%3Eult30%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EidIntegracao%3C%2Fk%3E%3Cv%3E73848%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqTipoIntegracao%3C%2Fk%3E%3Cv%3ECorreios%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E`;

        var dataString = 'xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>73848</v></e><e><k>dataIni</k><v>15/02/2022</v></e><e><k>dataFim</k><v>01/01/2050</v></e><e><k>periodo</k><v>periodo</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>periodo</v></e><e><k>idIntegracao</k><v>73848</v></e><e><k>psqTipoIntegracao</k><v>Correios</v></e></xjxobj>';


        var options = {
            url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
            method: 'POST',
            headers: headers,
            body: dataString
        };

        var found = false

        

        request(options, function (error, response) {

            if (error) throw new Error(error);
            var objects = JSON.parse(response.body)['data']

            // console.log("objects tag Correio:", objects)

            for (var i in objects){

                // console.log("getTagCorreios", objects[i].numeroPedido)

                if (objects[i].numeroPedido === idOrder){

                    found = true

                    var objectID = objects[i].id

                    console.log(objectID)
                    
                    var dataString = `xajax=imprimirRotulo&xajaxs=&xajaxr=1644588870539&xajaxargs[]=%3Cxjxobj%3E%3Ce%3E%3Ck%3Eetiquetas%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3Ce%3E%3Ck%3E0%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3Ce%3E%3Ck%3EidObjetoPlp%3C%2Fk%3E%3Cv%3E${objectID}%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpossuiEtiqueta%3C%2Fk%3E%3Cv%3E1%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E&xajaxargs[]=etiqueta&xajaxargs[]=1`;
                    
                    var options = {
                        url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotulo',
                        method: 'POST',
                        headers: headers,
                        body: dataString
                    };

                    // console.log("objectID", objectID)

                    function callback(error, response, body) {

                    
                        if (!error && response.statusCode == 200) {

                            var objectData = body.replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[montarPaginaImpressao('etiquetasModelo3', `, "")
                            objectData = objectData.replace(`)]]></cmd><cmd n="js">closeWait('impressaoWait')</cmd><cmd n="js"><![CDATA[mostraSurvey("Correios");]]></cmd></xjx>`, "")
                                                            

                            var dataString = `{"dadosRotulo":${JSON.stringify(objectData).replace(/\\/g, '').slice(1, -1)}}`;

                            var options = {
                                url: 'https://www.bling.com.br/impressao/etiquetaCorreiosModelo3.php',
                                method: 'POST',
                                headers: headers,
                                body: dataString
                            };

                            function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    // console.log("Body tag Correio:", body)
                                    res.setHeader("Content-Type", "text/html")
                                    res.write(body);
                                    res.end()
                                }
                                else{
                                    console.log(error)
                                }
                            }

                            request(options, callback);


                        }
                    }

                    request(options, callback);

                }

            }

            if (!found){
                res.status(200).send('Not found');
            }

        });
    } 
    async function getTagViaVarejo(){
        var request = require('request');
        
        // var dataString = `xajax=listarObjetos&xajaxs=&xajaxr=1644587692850&xajaxargs[]=%3Cxjxobj%3E%3Ce%3E%3Ck%3Epesquisa%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Eordenar%3C%2Fk%3E%3Cv%3ED%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Esituacao%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EsituacaoObjeto%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqSituacaoPedido%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqMultiloja%3C%2Fk%3E%3Cv%3E0%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqNPedidoLV%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqRemessa%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqEstado%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqTipoLog%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqNPedidoPlp%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EfiltroDinamico%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Epagina%3C%2Fk%3E%3Cv%3E1%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EnomeIntegracao%3C%2Fk%3E%3Cv%3E73848%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataIni%3C%2Fk%3E%3Cv%3E12%2F01%2F2022%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataFim%3C%2Fk%3E%3Cv%3E11%2F02%2F2022%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Eperiodo%3C%2Fk%3E%3Cv%3Eult30%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EperiodoPeriod%3C%2Fk%3E%3Cv%3EPer%C3%ADodo%20customizado%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EdataOpc%3C%2Fk%3E%3Cv%3Edata%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3Ecriterio%3C%2Fk%3E%3Cv%3Eult30%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EidIntegracao%3C%2Fk%3E%3Cv%3E73848%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpsqTipoIntegracao%3C%2Fk%3E%3Cv%3ECorreios%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E`;

        // var dataString = 'xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>73848</v></e><e><k>dataIni</k><v>15/02/2022</v></e><e><k>dataFim</k><v>01/01/2050</v></e><e><k>periodo</k><v>periodo</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>periodo</v></e><e><k>idIntegracao</k><v>73848</v></e><e><k>psqTipoIntegracao</k><v>Correios</v></e></xjxobj>';

        var dataString = `xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v>${idOrder}</v></e><e><k>ordenar</k><v>V</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>163507</v></e><e><k>dataIni</k><v>17/04/2022</v></e><e><k>dataFim</k><v>17/05/2022</v></e><e><k>periodo</k><v>ult30</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ult30</v></e><e><k>idIntegracao</k><v>163507</v></e><e><k>psqTipoIntegracao</k><v>Envvias</v></e></xjxobj>`;


        var options = {
            url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
            method: 'POST',
            headers: headers,
            body: dataString
        };

        var found = false

        

        request(options, function (error, response) {

            if (error) throw new Error(error);
            var objects = JSON.parse(response.body)['data']

            // console.log("objects tag Correio:", objects)

            for (var i in objects){

                // console.log("getTagCorreios", objects[i].numeroPedido)

                if (objects[i].numeroPedido === idOrder){

                    found = true

                    var objectID = objects[i].id

                    console.log(objectID)
                    
                    // var dataString = `xajax=imprimirRotulo&xajaxs=&xajaxr=1644588870539&xajaxargs[]=%3Cxjxobj%3E%3Ce%3E%3Ck%3Eetiquetas%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3Ce%3E%3Ck%3E0%3C%2Fk%3E%3Cv%3E%3Cxjxobj%3E%3Ce%3E%3Ck%3EidObjetoPlp%3C%2Fk%3E%3Cv%3E%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EpossuiEtiqueta%3C%2Fk%3E%3Cv%3E1%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E&xajaxargs[]=etiqueta&xajaxargs[]=1`;
                    
                    var dataString = `xajax=imprimirRotuloExterno&xajaxargs[]=<xjxobj><e><k>etiquetas</k><v><xjxobj><e><k>0</k><v><xjxobj><e><k>idObjetoPlp</k><v>${objectID}</v></e><e><k>possuiEtiqueta</k><v>1</v></e></xjxobj></v></e></xjxobj></v></e></xjxobj>&xajaxargs[]=1`;


                    var options = {
                        url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotulo',
                        method: 'POST',
                        headers: headers,
                        body: dataString
                    };

                    // console.log("objectID", objectID)

                    function callback(error, response, body) {

                        // console.log(body)

                        if (!error && response.statusCode == 200) {
                            
                            var response = response.body
                                        .replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[mostraSurvey("Envvias");]]></cmd><cmd n="js"><![CDATA[updatePrintWin(`, "")
                                    response = response.slice(0, response.indexOf(`)]]></cmd><cmd n="js">`))
                                    
                            if (response.includes(`{"msg":["Envio n`)){
                                res.status(401).json(response);
                                return
                            }

                            response = JSON.parse(`[${response}]`.replace(/'/g, '"'))

                            var options = {
                                url: `https:${response[0]}`,
                                method: 'GET',
                                headers: headers,
 
                            };

                            function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {

                                    res.setHeader("Content-Type", "text/html")

                                    body = body.replace(`page-break-after: always;`, ``)
                                    body = body.replace(`window.print();`, ``)

                                    res.write(body);
                                    res.end()
                                }
                                else{
                                    console.log(error)
                                }
                            }

                            request(options, callback);


                        }
                    }

                    request(options, callback);

                }

            }

            if (!found){
                res.status(200).send('Not found');
            }

        });
    } 
    async function getTagMandae(){
        var request = require('request');

        var dataString = 'xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>173247</v></e><e><k>dataIni</k><v></v></e><e><k>dataFim</k><v></v></e><e><k>periodo</k><v>ultimos</v></e><e><k>periodoPeriod</k><v></v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ultimos</v></e><e><k>idIntegracao</k><v>173247</v></e><e><k>psqTipoIntegracao</k><v>Mandae</v></e></xjxobj>';

        var options = {
            url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
            method: 'POST',
            headers: headers,
            body: dataString
        };

        var found = false

        request(options, function (error, response) {

            if (error) throw new Error(error);
            var objects = JSON.parse(response.body)['data']

            // console.log(objects)

            for (var i in objects){

                if (objects[i].numeroPedido === idOrder){

                    

                    found = true

                    var objectID = objects[i].id

                    // console.log(objectID)

                    
                    var dataString = `xajax=imprimirRotuloExterno&xajaxargs[]=<xjxobj><e><k>etiquetas</k><v><xjxobj><e><k>0</k><v><xjxobj><e><k>idObjetoPlp</k><v>${objectID}</v></e><e><k>possuiEtiqueta</k><v>1</v></e></xjxobj></v></e></xjxobj></v></e></xjxobj>&xajaxargs[]=1`;


                    var options = {
                        url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotuloExterno',
                        method: 'POST',
                        headers: headers,
                        body: dataString
                    };


                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {

                            var objectData = body.replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[mostraSurvey("Mandae");]]></cmd><cmd n="js"><![CDATA[updatePrintWin('//www.bling.com.br/impressao/etiquetaMandae.php', `, "")
                                                    
                            objectData = objectData.replace(`)]]></cmd><cmd n="js">closeWait('impressaoWait')</cmd></xjx>`, "")
                            
                            objectData = JSON.parse(`[${objectData}]`)
                            
                            objectData = objectData[0]

                            
                            var dataString = `{"dadosRotulo":${JSON.stringify(objectData)}}`;

                            var options = {
                                url: 'https://www.bling.com.br/impressao/etiquetaMandae.php',
                                method: 'POST',
                                headers: headers,
                                body: dataString
                            };

                            function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    
                                    res.setHeader("Content-Type", "text/html")
                                    res.write(body);
                                    res.end()
                                }
                            }

                            request(options, callback);


                        }
                    }

                    request(options, callback);

                }

            }

            if (!found){
                res.status(200).send('Not found');
            }

        });
    } 
    async function getNfTagB2W(){
        var request = require('request');
        
        // var dataString = 'xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>90031</v></e><e><k>dataIni</k><v></v></e><e><k>dataFim</k><v></v></e><e><k>periodo</k><v>ultimos</v></e><e><k>periodoPeriod</k><v></v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ultimos</v></e><e><k>idIntegracao</k><v>90031</v></e><e><k>psqTipoIntegracao</k><v>B2WEntrega</v></e></xjxobj>';

        var dataString = `xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v>${idOrder}</v></e><e><k>ordenar</k><v>V</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>90031</v></e><e><k>dataIni</k><v>03/04/2022</v></e><e><k>dataFim</k><v>03/05/2052</v></e><e><k>periodo</k><v>periodo</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>periodo</v></e><e><k>idIntegracao</k><v>90031</v></e><e><k>psqTipoIntegracao</k><v>B2WEntrega</v></e></xjxobj>`;


        var options = {
            url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
            method: 'POST',
            headers: headers,
            body: dataString
        };

        var found = false

        request(options, function (error, response) {

            if (error) throw new Error(error);
            var objects = JSON.parse(response.body)['data']

            for (var i in objects){

                if (objects[i].numeroPedido === idOrder){

                    found = true

                    var objectID = objects[i].id

                    // console.log(objectID)
             
                    var dataString = `xajax=imprimirRotuloExterno&xajaxargs[]=<xjxobj><e><k>etiquetas</k><v><xjxobj><e><k>0</k><v><xjxobj><e><k>idObjetoPlp</k><v>${objectID}</v></e><e><k>possuiEtiqueta</k><v>1</v></e></xjxobj></v></e></xjxobj></v></e></xjxobj>&xajaxargs[]=1`;

                    var options = {
                        url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotuloExterno',
                        method: 'POST',
                        headers: headers,
                        body: dataString
                    };


                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {

                            // console.log(response.body)

                            var objectData = body.replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[mostraSurvey("B2WEntrega");]]></cmd><cmd n="js"><![CDATA[updatePrintWin(`, "")
                                                    
                            objectData = objectData.replace(`)]]></cmd><cmd n="js">closeWait('impressaoWait')</cmd></xjx>`, "")

                            objectData = `[${objectData}]`.replace(/'/g, '"')

                            objectData = JSON.parse(objectData)

                            objectData = objectData[1]

                            // console.log(objectData)

                            var dataString = `{"dadosRotulo":${JSON.stringify(objectData)}}`;

                            var options = {
                                url: 'https://www.bling.com.br/impressao/etiquetaB2WEntrega.php',
                                method: 'POST',
                                headers: headers,
                                body: dataString
                            };

                            function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    
                                    res.setHeader("Content-Type", "text/html")
                                    res.write(body);
                                    res.end()
                                }
                            }

                            request(options, callback);


                        }
                    }

                    request(options, callback);

                }

            }

            if (!found){
                res.status(200).send('Not found');
            }

        });
    } 
    async function getTagMagaLu(){
        var axios = require('axios');

        async function getTagIdFromBling(){

            var dataString = `xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v>${idOrder}</v></e><e><k>ordenar</k><v>V</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>91012</v></e><e><k>dataIni</k><v>03/04/2021</v></e><e><k>dataFim</k><v>03/05/2050</v></e><e><k>periodo</k><v>ult30</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ult30</v></e><e><k>idIntegracao</k><v>91012</v></e><e><k>psqTipoIntegracao</k><v>MagaluEntregas</v></e></xjxobj>`;

            var options = {
                url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
                method: 'POST',
                headers: headers,
                body: dataString
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {

                    // console.log(response.body)
                    
                    var objects = JSON.parse(response.body)['data']

                    console.log("Pedido MagaLu encontrado: ", objects);
                    
                    for (var i in objects){

                        if (objects[i].numeroPedidoOrigem === idOrder){
                            console.log("Pedido MagaLu encontrado: ", objects[i].id);
                            console.log("Pedido MagaLu: ", objects[i].numeroPedidoOrigem);
                            
                            var objectId = objects[i].id

                            var dataString = `xajax=imprimirRotuloExterno&xajaxargs[]=<xjxobj><e><k>etiquetas</k><v><xjxobj><e><k>0</k><v><xjxobj><e><k>idObjetoPlp</k><v>${objectId}</v></e><e><k>possuiEtiqueta</k><v>1</v></e></xjxobj></v></e></xjxobj></v></e></xjxobj>&xajaxargs[]=1&xajaxargs[]=zpl2`;

                            var options = {
                                url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotuloExterno',
                                method: 'POST',
                                headers: headers,
                                body: dataString
                            };

                            async function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log("Etiqueta gerada com sucesso!");

                                    var response = response.body
                                        .replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[mostraSurvey("MagaluEntregas");]]></cmd><cmd n="js"><![CDATA[updatePrintWin(`, "")
                                    response = response.slice(0, response.indexOf(`)]]></cmd><cmd n="js">`))
                                    
                                    if (response.includes(`{"msg":["Envio n`)){
                                        res.status(401).json(response);
                                        return
                                    }

                                    response = JSON.parse(`[${response}]`.replace(/'/g, '"'))

                                    console.log(response)

                                    var tagLink = response[2].trackingLabel.url

                                    console.log(tagLink)

                                    console.log("Link da etiqueta: ", tagLink)
                                    
                                    await getTagFromMagalu(tagLink)

                                }
                            }

                            request(options, callback);

                        }
                    }

                }
            }
            
            request(options, callback);
        }

        async function getTagFromMagalu(tagLink){ 
          var config = {
              method: 'get',
              url: tagLink,
              headers: { },
              responseType: 'arraybuffer'
          };
          
          await axios(config)
          .then(async function (response) {

                var buffer = response.data;

                await readFileDownloaded(buffer)
          })
          .catch(function (error) {
            console.log(error);
          });
        }
      
        async function readFileDownloaded(data){
            await descompressFile()

            fs.writeFile("src/dist/magalu/ml_tag.zip", data,  "binary", async function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!")
                    
                    await descompressFile()
                }
            });
        }
        async function descompressFile(){
            await decompress('src/dist/magalu/ml_tag.zip', 'src/dist/magalu/').then(async function(files){
              console.log('Descompressed!')
            
            //   return
              await getLaberaryPDF()
            
            })
        }
          
        async function getLaberaryPDF(){
      
          console.log("getLaberaryPDF")
      
          const request = require('request');
      
          var zpl = fs.readFileSync("src/dist/magalu/etiquetas.zpl", "utf-8")
          
          var options = {
              encoding: null,
              formData: { file: zpl },
              url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
          };

          request.post(options, async function(err, resp, body) {
                if (err) {
                    return console.log(err);
                }
        
                // res.setHeader("Content-Type", "text/html")
                res.send(`
                <div >
                    <img src="data:image/jpeg;base64, ${body.toString('base64')}" style="width:100mm;height:130mm;" alt="Etiqueta MeLi">
                </div>`
                )
                res.end()
                
            });
      
        }     

        await getTagIdFromBling()

        await getTagFromMagalu()

    }
    async function getTagMercadoLivre(){
        var axios = require('axios');

        async function getTagIdFromBling(){

            var dataString = 'xajax=listarObjetos&xajaxargs[]=<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>58288</v></e><e><k>dataIni</k><v>03/04/2022</v></e><e><k>dataFim</k><v>03/05/2050</v></e><e><k>periodo</k><v>ult30</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ult30</v></e><e><k>idIntegracao</k><v>58288</v></e><e><k>psqTipoIntegracao</k><v>MercadoEnvios</v></e></xjxobj>';

            var options = {
                url: 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
                method: 'POST',
                headers: headers,
                body: dataString
            };
            
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    
                    var objects = JSON.parse(response.body)['data']

                    for (var i in objects){

                        if (objects[i].numeroPedidoOrigem === idOrder){
                            console.log("Pedido MeLi encontrado: ", objects[i].id);
                            console.log("Pedido MeLi: ", objects[i].numeroPedidoOrigem);
                            
                            var objectId = objects[i].id

                            var dataString = `xajax=imprimirRotuloExterno&xajaxargs[]=<xjxobj><e><k>etiquetas</k><v><xjxobj><e><k>0</k><v><xjxobj><e><k>idObjetoPlp</k><v>${objectId}</v></e><e><k>possuiEtiqueta</k><v>1</v></e></xjxobj></v></e></xjxobj></v></e></xjxobj>&xajaxargs[]=1&xajaxargs[]=zpl2`;

                            var options = {
                                url: 'https://www.bling.com.br/services/correios.plp.server.php?f=imprimirRotuloExterno',
                                method: 'POST',
                                headers: headers,
                                body: dataString
                            };

                            async function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log("Etiqueta gerada com sucesso!");
                                    console.log(response.body);

                                    var response = response.body
                                        .replace(`<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="js"><![CDATA[mostraSurvey("MercadoEnvios");]]></cmd><cmd n="js"><![CDATA[updatePrintWin(`, "")
                                    response = response.slice(0, response.indexOf(`)]]></cmd><cmd n="js">`))
                                    
                                    if (response.includes(`{"msg":["Envio n`)){
                                        res.status(401).json(response);
                                        return
                                    }

                                    
                                    response = JSON.parse(`[${response}]`.replace(/'/g, '"'))

                                    console.log(response)


                                    var tagLink = response[2].trackingLabel.url

                                    console.log(tagLink)

                                    console.log("Link da etiqueta: ", tagLink)

                                    if (tagLink === ""){
                                        res.status(404).json("Etiqueta não diponível!");
                                        return
                                    }
                                    
                                    await getTagFromMercadoLivre(tagLink)

                                }
                            }

                            request(options, callback);

                        }
                    }

                }
            }
            
            request(options, callback);
        }

        async function getTagFromMercadoLivre(tagLink){ 
          var config = {
              method: 'get',
              url: tagLink,
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
          fs.writeFile("src/dist/mercadolivre/ml_tag.zip", data,  "binary", async function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
                await descompressFile()
            }
        })
        }
        async function descompressFile(){
            await decompress('src/dist/mercadolivre/ml_tag.zip', 'src/dist/mercadolivre/').then(async function(files){
              console.log('Descompressed!' );
              await getLaberaryPDF()            
            })
        }
          
        async function getLaberaryPDF(){
      
          console.log("getLaberaryPDF")
      
          const request = require('request');
      
          var zpl = fs.readFileSync("src/dist/mercadolivre/Etiqueta de envio.txt", "utf-8")
          
          var options = {
              encoding: null,
              formData: { file: zpl },
              url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
          };

          request.post(options, async function(err, resp, body) {
                if (err) {
                    return console.log(err);
                }
        
                res.setHeader("Content-Type", "text/html")
                res.write(`
                <div >
                    <img src="data:image/jpeg;base64, ${body.toString('base64')}" style="width:100mm;height:130mm;" alt="Etiqueta MeLi">
                </div>`
                )
                res.end()
            });
      
        }
      

        await getTagIdFromBling()

        // await getTagFromMercadoLivre()
 
        // await descompressFile()

        // await getLaberaryPDF()

    }
}