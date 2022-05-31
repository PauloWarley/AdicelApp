import { createConnection } from 'mysql2';

const connection =  createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'automate'
});

module.exports.executeQuery = async function (query) {
    // console.log("QUERY completa", req.body.query)

    console.log(query)



    var i = connection.query(query, function (err, result, fields) { 
        
        // console.log("result", result)

        if (result){
            return  result 
        }
        // else if (err){
        //     res.status(400).json( result )
        // }

        callback(null, result);

    })

    console.log(i)
}