const decompress = require('decompress');
const fs = require('fs');



export default async function mercadolivre(req, res){
  
  var axios = require('axios');

  async function getTagFromMercadoLivre(){ 
    var config = {
        method: 'get',
        url: 'https://api.mercadolibre.com//shipment_labels?access_token=APP_USR-1954489517989554-031512-00fa35a94e6efe15fe9c31c063719861-241329536&channel=meli&response_type=zpl2&shipment_ids=41243623499',
        headers: { },
        responseType: 'arraybuffer'
    };
    
    await axios(config)
    .then(function (response) {
      readFileDownloaded(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  async function readFileDownloaded(data){
    fs.writeFile("ml_tag.zip", data,  "binary", async function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");

          
    
      }
  });
  }

  async function getLaberaryPDF(){

    console.log("getLaberaryPDF")

    const request = require('request');

    var zpl = fs.readFileSync("src/dist/mercadolivre/Etiqueta de envio.txt", "utf-8")
    
    var options = {
        encoding: null,
        formData: { file: zpl },
        headers: { 'Accept': 'application/pdf' },
        url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/'
    };

    request.post(options, async function(err, resp, body) {
        if (err) {
            return console.log(err);
        }

        console.log("getLaberaryPDF")

        res.write(body)
        res.end()
    });

  }

  async function descompressFile(){
    await decompress('ml_tag.zip', 'src/dist/mercadolivre').then(async function(files){
      console.log('done!', );
    
    });
  }
  

  // await getTagFromMercadoLivre()

  await descompressFile()
  await getLaberaryPDF()

}


