var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://www.bling.com.br/services/correios.plp.server.php?f=listarObjetos',
  'headers': {
    'authority': 'www.bling.com.br',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
    'content-type': 'application/x-www-form-urlencoded',
    'sec-ch-ua-mobile': '?0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
    'session-token': 'qsimufpsuqcjv1fj4jp8val1l8',
    'sec-ch-ua-platform': '"Windows"',
    'accept': '*/*',
    'origin': 'https://www.bling.com.br',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://www.bling.com.br/integracoes.logisticas.php',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'cookie': '_gcl_au=1.1.451156857.1639168075; _fbp=fb.2.1639168075700.770256098; _gid=GA1.3.856229446.1644231907; initial_referer=%2F; _clck=dms5j1|1|eyw|0; __zlcmid=18UkhO58DetRmBR; _ga=GA1.3.610427492.1639168075; _uetsid=2f6521c08a7511ec962e7baf1e889603; _uetvid=a87e4e5059f711ecaefc43ec20c67f9c; _clsk=1fbvwtm|1644588820751|7|0|e.clarity.ms/collect; PHPSESSID=qsimufpsuqcjv1fj4jp8val1l8; PCSID=a6ee1913005d4b8cb7849460fdf6c8e2592f5269; WSSID=qsimufpsuqcjv1fj4jp8val1l8; _ga_3QBHN0MFWR=GS1.1.1644587440.46.1.1644588822.57; _gat=1; mp_89dc10374c4e80cb7322ffa49d0220cf_mixpanel=%7B%22distinct_id%22%3A%20%226187741327%22%2C%22%24device_id%22%3A%20%2217da60816dfc2a-0959aec4d3c5a3-978153c-1fa400-17da60816e096c%22%2C%22%24user_id%22%3A%20%226187741327%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.bling.com.br%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.bling.com.br%22%7D; avisoVisualizado=1644606072'
  },
  form: {
    'xajax': 'listarObjetos',
    'xajaxargs[]': '<xjxobj><e><k>pesquisa</k><v></v></e><e><k>ordenar</k><v>D</v></e><e><k>situacao</k><v></v></e><e><k>situacaoObjeto</k><v></v></e><e><k>psqSituacaoPedido</k><v></v></e><e><k>psqMultiloja</k><v>0</v></e><e><k>psqNPedidoLV</k><v></v></e><e><k>psqRemessa</k><v></v></e><e><k>psqEstado</k><v></v></e><e><k>psqTipoLog</k><v></v></e><e><k>psqNPedidoPlp</k><v></v></e><e><k>filtroDinamico</k><v><xjxobj></xjxobj></v></e><e><k>pagina</k><v>1</v></e><e><k>nomeIntegracao</k><v>173247</v></e><e><k>dataIni</k><v>12/01/2022</v></e><e><k>dataFim</k><v>11/02/2052</v></e><e><k>periodo</k><v>ult30</v></e><e><k>periodoPeriod</k><v>Período customizado</v></e><e><k>dataOpc</k><v>data</v></e><e><k>criterio</k><v>ult30</v></e><e><k>idIntegracao</k><v>173247</v></e><e><k>psqTipoIntegracao</k><v>Mandae</v></e></xjxobj>'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(JSON.parse(response.body)[0]);
});
