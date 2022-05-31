const jwt = require("jsonwebtoken")

import { useRouter } from 'next/router'

const SECRET = "#H3lPwarr"

export default function cliente(req, res){

    function verifyJWT(req, res){

        const token = req.headers["x-acces-token"]
        jwt.verify(token, SECRET, (err, decoded) => {
            
            console.log("token :",token)
            
            if (err) return res.status(401).send({
            auth: false
            });

            return res.status(200).send({

            auth: true

            });
  
        })
  
    }

    verifyJWT(req, res)

}