const jwt = require("jsonwebtoken")


const SECRET = process.env.SECRET
// const SECRET = "shhhhh"
var host = process.env.HOST
// host="http://localhost:3000"


export default function Login(req, res) { 

    let db = {user: "paulo@blackhole", password: "1234", userId: 1}



    if (req.method === "POST"){


      var query = `select * from usuarios WHERE login='${req.body.user}' AND senha=md5('${req.body.password}')`

      let data={query : query}

      console.log("INFO: ", data, req.body.user, req.body.password)


      fetch(`${host}/api/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)

        })
        .then( (response) => 
          response.json()
          .then( resp => {
            
            console.log("response: ", resp, response.status )

            if (resp.length != 0)
            {
              console.log("STATUS: ", 200)
              if (res != []){
    
                  const token = jwt.sign({userId: resp.ID, user: resp.login}, SECRET, {expiresIn: 300})
                  let decode = jwt.verify(token, SECRET)
    
                  res.status(200).json({   
                    auth: true,
                    user: resp.login,
                    token: token,
                  })
              }
              else{
    
                res.status(401).end()
    
              }
            
            }
            
            else
            {
              res.status(401).end()
            }
          } 
                  
        )
      )
    }
  }

     