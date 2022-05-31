import { useState } from "react";
import PopupWindow from "../../components/PopupWindow"
import styles from "../../styles/Checkout.module.css"
import axios from "axios"


export default function PedidoRet() {
    var [loading, SetLoading] = useState ("")

    async function postImported() {

        console.log("importado");
        
        var config = {
        method: 'post',
        url: '/api/pedidoret',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : {
            "origem": "importado"
            }
        };

        SetLoading(LoadingAnimation())

        await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

        SetLoading("")

    }

    async function postNational() {

        
        var config = {
        method: 'post',
        url: '/api/pedidoret',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : {
            "origem": "nacional"
            }
        };

        SetLoading(LoadingAnimation())

        await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

        SetLoading("")

    }

    function LoadingAnimation(){


        return (
            <PopupWindow style = {
                {
                    "display":"flex",
                    "justifyContent":"center",
                    "marginTop": "30vh"
                }
            }  width={"auto"} className={styles.popupconfirm}  id="next_order" tabIndex={-1}>
                
                <div className={styles.loader}></div>
                <div style = {
                    {
                        "fontSize":"4vw",
                        "color": "white",
                        "margin": "2vw"
                    }
                } > Gerando Pedido</div>

            </PopupWindow>
        )
    }



    return (
        <main>

            <title>
                Pedido de Transferência
            </title>

            {loading}

            <div style={{
                        display: 'flex',
                        width:"100vw",
                        flexDirection:"row",
                        justifyContent:"center",
                        fontSize: "50px",
                        fontSizeAdjust: "2",
                    }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '50px'
                    }}>

                    <button onClick={async function(){ await postNational() }} style={{
                        height:"100px",
                        width:"20vw",
                        margin: '50px',
                        fontSize: "30px",
                    }}>
                        Validar
                    </button>

                    <button onClick={async function(){ await postImported()}} style={{
                        height:"100px",
                        width:"20vw",
                        margin: '50px',
                        fontSize: "30px",
                    }}>
                        Produtos Importados
                    </button>
                    <button onClick={async function(){ await postNational() }} style={{
                        height:"100px",
                        width:"20vw",
                        margin: '50px',
                        fontSize: "30px",
                    }}>
                        Produtos Nacionais
                    </button>

                    
                </div>
            </div>
                
                
        </main>
    );
}