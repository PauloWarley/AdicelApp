import axios from "axios";

var sql = require("mssql");

const HOST = process.env.HOST

var server = `10.140.5.1\\SUPRASOFT`

var config = {
    user: 'sa',
    password: '2013@SupraSoft',
    server: server, 
    database: 'SGC',
    synchronize: true,
    trustServerCertificate: true
};


export default async function DatabaseSupra(req, res){

    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        var query = `
        SELECT TOP (1000) [SGC].[dbo].bi_cadastro_clientes.Nome_Razão_Social , [SGC].[dbo].pedido.codigo 
        FROM [SGC].[dbo].pedido
        INNER JOIN 
            [SGC].[dbo].bi_cadastro_clientes
        ON 
            clifor_codigo=bi_cadastro_clientes.Código AND
            id_nota_fiscal='1' AND id_estoque='1' AND  (id_situacao='3' or id_situacao='4')
        
        `
    
        // query to the database and get the records
        request.query(query, function (err, recordset) {
            
            if (err) console.log(err)

            recordset = recordset["recordset"]

            // console.log(recordset)
            
            sendMail(recordset)

            // console.log(product_alert_list)

            // res.status(200).json(recordset);
            
        });
    });

    function sendMail(ordersAlert){
        var data = {ordersAlertStock: ordersAlert}
        axios.post(
            `${HOST}/api/integracoes/sendmail`, data
            ).then((value) => res.status(200).json(value.data))     
    }
}
