var encryptionKey = 'viking institucionalizado'

var password = 'Suporte123!'

var CryptoJS = require("crypto-js");

const HOST = process.env.HOST


export default function Login(req, res){

    var hash = CryptoJS.AES.encrypt(password, encryptionKey).toString()

    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://www.bling.com.br/Api/v3/auth',
    'headers': {
        'authority': 'www.bling.com.br',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
        'sec-ch-ua-mobile': '?0',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'sec-ch-ua-platform': '"Windows"',
        'content-type': 'application/json',
        'accept': '*/*',
        'origin': 'https://www.bling.com.br',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.bling.com.br/login',
        'accept-language': 'pt-BR,pt;q=0.9',
        'cookie': 'initial_referer=%2F; _fbp=fb.2.1646319113037.1796040846; _gcl_au=1.1.797636040.1646319113; _gid=GA1.3.1756056534.1646319113; _clck=9ovagq|1|ezg|0; PHPSESSID=14bh62se02f4fd2live726f10c; PCSID=d3b196d60fa7590b7cbc9ac934682c0b27fa4d15; _gat=1; mp_89dc10374c4e80cb7322ffa49d0220cf_mixpanel=%7B%22distinct_id%22%3A%20%226187741327%22%2C%22%24device_id%22%3A%20%2217f5044a66519b-0d8fba283596fe-a3e3164-1fa400-17f5044a6674c4%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.bling.com.br%2Flogin%22%2C%22%24initial_referring_domain%22%3A%20%22www.bling.com.br%22%2C%22%24user_id%22%3A%20%226187741327%22%7D; _ga_3QBHN0MFWR=GS1.1.1646319113.1.1.1646319161.12; _ga=GA1.3.842247892.1646319113; _uetsid=76fb03409b0111ecb6937343371ba36b; _uetvid=76fb15b09b0111ecabd2c72c365cc773; _clsk=bwrgc3|1646319162503|3|0|d.clarity.ms/collect; __zlcmid=18okkR6cj3NXXOq; _gali=username; PCSID=c442f891c84e58bc503eeda05add48e1f949c9bc; PHPSESSID=0q69rnle0h7kbsqhgrtih1g7a1'
    },
    body: JSON.stringify({
        "login": "suportewms@adicel",
        "password": hash,
        "redirectUrl": ""
    })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);

        console.log(response.headers["set-cookie"])

        var responseCookies = response.headers["set-cookie"]

        var PHPSESSID = responseCookies[0].replace("PHPSESSID=", "").replace("; path=/; secure; HttpOnly", "")
        var PCSID = responseCookies[1].replace("PCSID=", "").replace("; path=/", "")

        // console.log(PHPSESSID, PCSID)

        var query = [
            `UPDATE automate.integracao_bling SET VALUE = '${PCSID}' WHERE (ID = 'PCSID');`,
            `UPDATE automate.integracao_bling SET VALUE = '${PHPSESSID}' WHERE (ID = 'PHPSESSID');`
        ]
        
        for (var i in query){
            let data={query : query[i]}

            new Promise((resolve, reject) => {
                fetch(`${HOST}/api/database`, {
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
                            resolve()
                        }
                        
                    } 
                            
                    )
                )
            })
        }

        res.status(200).json({"Response": "PCSID and PHPSESSID Updated"})
        

        });

}
