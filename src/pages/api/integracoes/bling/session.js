const HOST = process.env.HOST

export default function Session(req, res){

    if ( req.method === "GET"){

        var query = ` 
            SELECT * FROM automate.integracao_bling;    
        `


        let data={query : query}

        // console.log("INFO: ", data.query)

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
                    
                        var responseToSend = {}

                        for (var i in resp){

                            responseToSend[Object.values(resp[i])[0]] = Object.values(resp[i])[1]
                        }

                        res.status(200).json(responseToSend)

                        resolve()
                    }
                    
                } 
                        
                )
            )
        })

        
    }


}