import axios from "axios";
import { useEffect, useState } from "react"
import styles from "../../../../styles/Etiquetas.module.css"
import PopupWindow from "../../../../components/PopupWindow"
import { useRouter } from "next/router"

export default function Etiquetas(){

    var [order, setOrder] = useState("")
    var [loading, setLoading] = useState(<></>)
    var OnFocus = "input_text"

    const router = useRouter()

    var {
        query: { id },
    } = router

    async function GetAllOrders(){

        
        var config = {
            method: 'get',
            url: `/api/get_order/?situacao=["Aguardando NF"]&romaneio=${id}`,
        }

        await axios (config)
        .then(async function (response) {

            const orders = response.data

            document.getElementById("contagem").innerHTML = `Restam ${orders.length} ordens`

            if (orders.length == 0){
                await axios.put(`/api/packing_list/?id=${id}&status=tagged`)
            }

        })
    }

    async function printTag(){

        for (var i = 0; i < order.length; i++){
            
            if (order[i].id === order){
                console.log("order", order[i])
            }
        
        }

        document.getElementById('input_text').readOnly = true;


        console.log(order)

        var config = {
            method: 'get',
            url: `/api/get_order/${order}/?situacao=["Aguardando NF", "Atendido"]&romaneio=${id}`
        };

        
        setLoading(LoadingAnimation())
        

        await axios (config)
        .then(async function (response) {

            /* MUDA SITUAÇÃO PARA ATENDIDO */
            updateStateOnDB(order, 4)

            console.log("response 1", response.data) 

            if (response.data.length === 0){
                setLoading(<></>)
                console.log("Ordem não encontrada!")
                return
            }

            var idOrderBling = response['data'][0]['ID_pedido']
            var logistic = response['data'][0]['Transportadora']
            var market = response['data'][0]['Loja']

            console.log("idOrderBling", idOrderBling)


            /* ########## IMPRIME A NOTA FISCAL ########## */
            

            var config = {
                method: 'get',
                url: `/api/integracoes/bling/get_nf/${idOrderBling}`
            };

            await axios (config)
            .then(function (response2) {
                // console.log(response2["data"])

                var pri = document.getElementById("ifmcontentstoprint").contentWindow;
                pri.document.open();
                
                const today = new Date()
                let h = today.getHours()
                let m = today.getMinutes()
                let s = today.getSeconds()
                m = `${m}`.padStart(2, '0')
                s = `${s}`.padStart(2, '0')

                pri.document.write("identificação:&nbsp;", idOrderBling, "&nbsp;",`${h}:${m}:${s}`);
                pri.document.write(response2["data"]);
                
                pri.document.close()

                document.querySelector("iframe").addEventListener( "load", printOnLoad);

                function printOnLoad(){

                    pri.focus();
                    pri.print();
                    document.querySelector("iframe").removeEventListener( "load", printOnLoad );
                    document.getElementById("input_text").focus()
                }

            })

            //########## IMPRIME A ETIQUETA DE ENVIO ##########
            var config = {
                method: 'get',
                url: `/api/integracoes/bling/get_tag/${idOrderBling}?logistic=${logistic + market}`
            };

            console.log(`/api/integracoes/bling/get_tag/${idOrderBling}?logistic=${logistic + market}`)

            await axios (config)
            .then(function (response2) {

                if (response2.data === "Not found"){

                    document.getElementById("msg").setAttribute("open","true")
                    document.getElementById("msg").setAttribute("style", "animation: 0.25s linear 0s 1 normal forwards running popup")
        
                    // document.getElementById("msg").removeAttribute("open","true")
                    // document.getElementById("msg").removeAttribute("style", "animation: 0.25s linear 0s 1 normal forwards running popup")
                    return

                }

                var pri = document.getElementById("ifmcontentstoprint").contentWindow;
                pri.document.open();

                const today = new Date()
                let h = today.getHours()
                let m = today.getMinutes()
                let s = today.getSeconds()
                m = `${m}`.padStart(2, '0')
                s = `${s}`.padStart(2, '0')
                
                pri.document.write("identificação:&nbsp;", idOrderBling, "&nbsp;",`${h}:${m}:${s}`);
                pri.document.write(response2["data"]);

                console.log('response2["data"]', response2)
                
                pri.document.close()

                document.querySelector("iframe").addEventListener( "load", printOnLoad);

                function printOnLoad(){

                    pri.focus();
                    pri.print();
                    document.querySelector("iframe").removeEventListener( "load", printOnLoad );
                    document.getElementById("input_text").focus()
                }

            })
            
        })

        GetAllOrders()

        setLoading(<></>)
        document.getElementById('input_text').readOnly = false;
    }

    function LoadingAnimation(){

        document.getElementById("ifmcontentstoprint").focus()
        
        return (
            <PopupWindow  style={
                {
                    "display":"flex",
                    "justifyContent":"center",
                    "marginTop": "30vh"
            
                }
            }  width={"auto"} className={styles.popupconfirm}  id="next_order" tabIndex={-1}>
                
                <div className={styles.loader}></div>
                <div style={
                    {
                        "fontSize":"4vw",
                        "color": "white",
                        "margin": "2vw"
                                        
                    }
                }>Gerando Etiquetas!</div>

            </PopupWindow>
        )
    }

    function updateStateOnDB(idPedido, idSituacao){

        // return

        var data = JSON.stringify({
            "idPedido": idPedido,
            "idSituacao": idSituacao
            });
    
            var config = {
            method: 'put',
            url: `/api/update_order/?${idPedido}`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };
    
            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });    

    }

    useEffect ( () => {

        document.getElementById(OnFocus).focus();

    }, [OnFocus] )

    useEffect(() =>{
        if(!router.isReady) return;

        GetAllOrders()

    }, [router.isReady]);

    return (

        <div className={styles.layout}>
        
            <div style={{display: "flex"}}>
                <div style={{

                    display: "flex",
                    // marginRight:"100px",
                    width:"30%",
                    height:"auto",
                    borderRadius: "10px",
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>

                <h1 id="contagem" style={{margin: "10px"}}></h1>

                </div>

                <iframe style={{display: "none"}} id="ifmcontentstoprint"></iframe>

                {loading}

                <div>
                    <h1>Finalização: Etiquetas</h1>

                    <div className={styles.Checkout}>

                        <div>
                            <input  id="input_text" type="text" placeholder="Escaneie uma caixa..." 
                                onChange={ e =>{
                                    setOrder(e.target.value )
                                }}
                                onKeyPress={ e => {
                                    if (e.charCode === 13 && e.target.value != ""){
                                        e.target.value = ""
                                        printTag()
                                    }
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}