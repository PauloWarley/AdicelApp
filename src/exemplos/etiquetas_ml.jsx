import axios from "axios";
import { useEffect, useState } from "react"

var HOST="http://localhost:3000"

HOST= process.env.HOST

HOST= ""

console.log("HOST", HOST)

export default function Etiquetas(){

    var [order, setOrder] = useState("")
    // var [pdf, setPDF] = useState("")



    function printTag(){


            //########## IMPRIME A ETIQUETA DE ENVIO ##########
            var config = {
                method: 'get',
                url: `/api/descompress`,
                responseType: 'arraybuffer'
            };

            axios (config)
            .then(function (response2) {
                // console.log(response2["data"])

                var pri = document.getElementById("ifmcontentstoprint").contentWindow;
                pri.document.open();
                
                

                const blob = new Blob([response2["data"]], {type : 'image/png'});

                const objectURL = URL.createObjectURL(blob)

                console.log(objectURL)

                pri.document.write(`<img src=${objectURL} style="width:100mm; height:130mm" ></img>`);

                // setPDF(<iframe  src={objectURL} ></iframe>)
                
                pri.document.close()

                var htmlCarregado = pri.document.documentElement.innerHTML

                // console.log(htmlCarregado.indexOf("body") )

                document.querySelector("iframe").addEventListener( "load", printOnLoad);

                function printOnLoad(){

                    pri.focus();
                    pri.print();
                    document.querySelector("iframe").removeEventListener( "load", printOnLoad );
                    document.getElementById("input_text").focus()
                }

            })



    }

    useEffect ( () => {

        document.getElementById("input_text").focus();

    }, [1] )


    return (

        <div>

        <iframe style={{display: "none"}} id="ifmcontentstoprint"></iframe>
        
        <input id="input_text" type="text" placeholder="Escaneie uma caixa..." 
            onChange={ e =>{
                setOrder(e.target.value )
            }}
            onKeyPress={ e => {
                if (e.charCode === 13 && e.target.value != ""){
                    
                    e.target.value = ""
                    // test_print()
                    printTag()

                }
        }}/>

        </div>

    )
}