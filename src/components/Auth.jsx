// import Router from "next/router";
// import { useEffect } from "react";

// const SECRET = process.env.SECRET

// const jwt = require("jsonwebtoken")

// export default function AuthPage(props){
    
//     const RES_ERR = <div>Acesso não autorizado!</div>

//     function auth(props){

//         let token = props.token

//         return jwt.verify(token, SECRET, (err, decoded) => {
            

//             if (err || token == null) 
//                 {
//                 return RES_ERR;
//             }

//             else if (token != null){
//                 console.log("Autorizado!", decoded)
//                 return props.children
//             }

//         })

//     }

//     useEffect( () => {

//         if  (auth(props) === RES_ERR){
//             Router.push("/")
//         }
//     }, []

//     )

//     return auth(props);
    

// }

