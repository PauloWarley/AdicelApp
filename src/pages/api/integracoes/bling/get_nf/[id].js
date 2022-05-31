var request = require('request');

const HOST = process.env.HOST

export default function getNF(req, res){

  var idOrder = req.query.id

  var axios = require('axios');
     
  var config = {
    method: 'get',
    url: `${HOST}/api/integracoes/bling/session`,
  };

  axios(config)
  .then(function (response) {

    console.log(response.data)
    getNfTag(response.data.PCSID, response.data.PHPSESSID)

  })
  .catch(function (error) {
    console.log(error);
  });


  function getNfTag(PCSID, PHPSESSID) {
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
      'cookie': `_gcl_au=1.1.451156857.1639168075; _fbp=fb.2.1639168075700.770256098; initial_referer=%2F; leitorCodigoBarrasConferencia=undefined; _gid=GA1.3.1135925210.1646047199; avisoVisualizado=1646145620; _clck=dms5j1|1|ezg|0; __zlcmid=18okkQx5tBDmdm5; _uetsid=d3108fa09ae211ecb04a0319877b6cd2; _uetvid=a87e4e5059f711ecaefc43ec20c67f9c; _clsk=1cf8wu6|1646318033719|2|0|d.clarity.ms/collect; PHPSESSID=${PHPSESSID}; PCSID=${PCSID}; _ga_3QBHN0MFWR=GS1.1.1646317741.60.1.1646318035.56; _ga=GA1.3.610427492.1639168075; _gat=1; mp_89dc10374c4e80cb7322ffa49d0220cf_mixpanel=%7B%22distinct_id%22%3A%20%226187741327%22%2C%22%24device_id%22%3A%20%2217da60816dfc2a-0959aec4d3c5a3-978153c-1fa400-17da60816e096c%22%2C%22%24user_id%22%3A%20%226187741327%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.bling.com.br%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.bling.com.br%22%7D`
  };

    var dataString = `xajax=listarNotasFiscais&xajaxargs[]=S&xajaxargs[]=&xajaxargs[]=ult30&xajaxargs[]=1&xajaxargs[]=&xajaxargs[]=15/01/2022&xajaxargs[]=14/02/2050&xajaxargs[]=0&xajaxargs[]=false&xajaxargs[]=&xajaxargs[]=0&xajaxargs[]=&xajaxargs[]=&xajaxargs[]=&xajaxargs[]=&xajaxargs[]=<xjxobj><e><k>v.numeroPedido</k><v>${idOrder}</v></e></xjxobj>&xajaxargs[]=`;


    var options = {
        url: 'https://www.bling.com.br/services/notas.fiscais.server.php?f=listarNotasFiscais',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    request(options, function (error, response) {

      if (error) throw new Error(error);

      if (JSON.parse(response.body)['data'].length > 1) throw new Error(error);

      var order = JSON.parse(response.body)['data'][0]

      try{
        var NFid = order['idNota']
      }
      catch {
        res.status(200)
        return
      }

      console.log(NFid)

      var axios = require('axios');

      
      var config = {
        method: 'get',
        url: `https://www.bling.com.br/relatorios/danfe.simplificado.php?idNota1=${NFid}&fechaPopup=N`,

        headers: headers
      };

      axios(config)
      .then(function (response) {

        res.setHeader("Content-Type", "text/html")
        res.write(JSON.stringify(response.data).replace(`setTimeout('window.print()', 2000);`, "").replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\"/g, '"'));
        res.end()

      })
      .catch(function (error) {
        console.log(error);
      });

    });
  }


}