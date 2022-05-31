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

    var query = req.body.query

    // console.log("DatabaseSupra", query)
    
    return new Promise((resolve, reject) =>{
        sql.connect(config, function (err) {
        
            if (err) console.log(err);

            var request = new sql.Request();
        
            request.query(query, function (err, recordset) {
                
                if (err) console.log(err)

                res.status(200).json(recordset);
                
            });
        });
    })

}
