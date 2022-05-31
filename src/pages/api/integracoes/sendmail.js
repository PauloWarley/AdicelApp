var nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Outlook
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'automacaoadicel@hotmail.com',
        pass: 'Aut9@52062'
    }
});

export default async function sendMail(req, res){  

    var requestBody = req.body

    // console.log(Object.keys(requestBody)[0])

    var mailMode = Object.keys(requestBody)[0]
    
    
    function stockAlert(){
        
        return new Promise( (resolve, reject) => {
            if (req.method === "POST"){
    
                var html = `
                    <b>Olá pessoal, </b>
                    <br>
                    <b>Tudo bem? </b>
                    <br> <br>
                    <b>Estamos com alguns itens com baixo estoque, pode dar uma olhada?</b>
                    
                    `

                html += `<br> <br>Essses estão com o estoque abaixo do mínimo:<br><ul>`
                for (var i in requestBody.stockAlert.less_stock_minimum){
                    html += `<li>O ${requestBody.stockAlert.less_stock_minimum[i].nome} (${requestBody.stockAlert.less_stock_minimum[i].codigo})  está com ${requestBody.stockAlert.less_stock_minimum[i].estoque} unidades!</li>`
                }
                html += `</ul>`

                html += `<br> <br>Essses estão com o estoque igual ao mínimo:<br><ul>`
                for (var i in requestBody.stockAlert.equal_stock_mininum){
                    html += `<li>O ${requestBody.stockAlert.equal_stock_mininum[i].nome} (${requestBody.stockAlert.equal_stock_mininum[i].codigo})  está com ${requestBody.stockAlert.equal_stock_mininum[i].estoque} unidades!</li>`
                }                
                html += `</ul>`

                var mailOptions = {
                    from: '"BOTicel - Alerta" <automacaoadicel@hotmail.com>',
                    to: 'automacao@adicel.com.br, automacaoadicel@hotmail.com, compras@adicel.com.br, producao@adicel.com.br, qualidade@adicel.com.br',
                    // to: 'automacao@adicel.com.br, automacaoadicel@hotmail.com',
                    subject: 'Estamos com produtos em estoque baixo viu!.',
                    text: 'Produto Abaixo do Estoque',
                    html: html
                };
    
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        res.status(200).json({
                            "Response":"Message not sended.",
                            "Message sent: " : info.response})
                        reject()
                        return console.log(error);
                    }
    
                    res.status(200).json({
                        "Response":"Message sended.",
                        "Message sent: " : info.response})
                    resolve()
                });
            }
        })
    }
    function ordersAlertStock(){
        return new Promise( (resolve, reject) => {
            if (req.method === "POST"){
    
                var html = `
                    <b>Olá pessoal, </b>
                    <br>
                    <b>Tudo bem? </b>
                    <br> <br>
                    <b>Pedidos sem baixa do estoque:</b>
                    
                    `

                html += `<br> <br>Essses estão com o estoque abaixo do mínimo:<br><ul>`

                console.log(requestBody.ordersAlertStock.length)

                for (var i = 0; i < requestBody.ordersAlertStock.length; i ++){
                    console.log(requestBody.ordersAlertStock[i])
                    html += `<li>O ${requestBody.ordersAlertStock[i][Object.keys(requestBody.ordersAlertStock[i])[0]]} - ${requestBody.ordersAlertStock[i][Object.keys(requestBody.ordersAlertStock[i])[1]]}</li>`
                }
                html += `</ul>`

                // console.log(html)

                var mailOptions = {
                    from: '"BOTicel - Alerta" <automacaoadicel@hotmail.com>',
                    to: 'automacao@adicel.com.br, automacaoadicel@hotmail.com, compras@adicel.com.br, producao@adicel.com.br, qualidade@adicel.com.br',
                    // to: 'automacao@adicel.com.br, automacaoadicel@hotmail.com',
                    subject: 'Estamos com produtos em estoque baixo viu!.',
                    text: 'Produto Abaixo do Estoque',
                    html: html
                };
                
                // return
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        res.status(200).json({
                            "Response":"Message not sended.",
                            "Message sent: " : info})
                        reject()
                        return console.log(error);
                    }
    
                    res.status(200).json({
                        "Response":"Message sended.",
                        "Message sent: " : info.response})
                    resolve()
                });
            }
        })
    }

    if (mailMode === "stockAlert"){
        stockAlert()
    }
    else if(mailMode === "ordersAlertStock"){
        ordersAlertStock()
    }

}