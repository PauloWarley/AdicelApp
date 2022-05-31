// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'automate'
});

function WriteToFile(dbResponse){

    var txt = new ActiveXObject("Scripting.FileSystemObject");
    var s = txt.CreateTextFile("11.txt", true);
    s.WriteLine(dbResponse);
    s.Close();
}


export default function executeQuery(query) {
    console.log("QUERY completa",query)

    var result = "sem resposta"

    var res = connection.query(query, function teste(err, result, fields) { return result})

    console.log(result)

    return res.onResult().onResult
    
}

function getValue(result){

    console.log("no getvalue", result)

    return result

}

//export default {getValue, executeQuery}

// connection.query('SELECT * FROM usuarios',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     //console.log(fields); // fields contains extra meta data about results, if available
//   }
// );



// // with placeholder
// connection.query(
//   'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//   ['Page', 45],
//   function(err, results) {
//     console.log(results);
//   }
// );