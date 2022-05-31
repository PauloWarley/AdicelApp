const mysql = require('mysql2')

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})

connection.setMaxListeners(100)

// console.log("getMaxListeners",connection.getMaxListeners())


export default async function executeQuery(req, res) {

    var query = req.body.query

    // query = `UPDATE automate.integracao_bling SET VALUE = 'teste' WHERE (ID = 'PCSID')
    //          UPDATE automate.integracao_bling SET VALUE = 'teste2' WHERE (ID = 'PHPSESSID')`
    
    // console.log(query)




    return new Promise((resolve, reject) => {

        connection.query(query, async function (err, result, fields) { 


          if (result){

            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'max-age=180000')
            res.status(200).json(result)
            
            resolve()

          }
          else if (err){
              console.log(err.errno, err.message)

              res.status(405).end()
              resolve() 
          }
      })
  })
}