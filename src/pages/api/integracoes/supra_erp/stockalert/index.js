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
            SELECT TOP (1000) 
                [codigo],
                [nome],
                [Codigo_barra],
                [unid_unidade],
                [quantidade_unidade],
                [quantidade_estoque],
                [estoque_minimo],
                [estoque_maximo],
                [peso_liquido]
            FROM [SGC].[dbo].[produto]

            where data_exclusao is null
        `
    
        // query to the database and get the records
        request.query(query, function (err, recordset) {
            
            if (err) console.log(err)

            recordset = recordset["recordset"]

            var product_alert_list = {"equal_stock_mininum": [], "less_stock_minimum": []}

            for (var i in recordset){
                if (recordset[i].quantidade_estoque === recordset[i].estoque_minimo){
                    // console.log(`${recordset[i].nome} (${recordset[i].codigo}) atigiu o estoque mínimo!`)

                    product_alert_list.equal_stock_mininum.push({
                        nome: recordset[i].nome,
                        codigo: recordset[i].codigo,
                        estoque: Math.round(recordset[i].quantidade_estoque*100)/100,
                        estoque_minimo: recordset[i].estoque_minimo
                    })
                }
                if (recordset[i].quantidade_estoque < recordset[i].estoque_minimo){
                    // console.log(`${recordset[i].nome} (${recordset[i].codigo}) está abaixo do estoque mínimo!`)

                    product_alert_list.less_stock_minimum.push({
                        nome: recordset[i].nome,
                        codigo: recordset[i].codigo,
                        estoque: Math.round(recordset[i].quantidade_estoque*100)/100,
                        estoque_minimo: recordset[i].estoque_minimo
                    })
                }
            }

            product_alert_list.less_stock_minimum = product_alert_list.less_stock_minimum.sort((a, b) => a.estoque > b.estoque ? 1 : -1)

            // res.status(200).json(product_alert_list.less_stock_minimum)

            // return
            sendMail(product_alert_list)

            // console.log(product_alert_list)

            // res.status(200).json(product_alert_list);
            
        });
    });

    function sendMail(product_alert_list){
        var data = {stockAlert: product_alert_list}
        axios.post(
            `${HOST}/api/integracoes/sendmail`, data
            ).then((value) => res.status(200).json(value.data))     
    }
}
