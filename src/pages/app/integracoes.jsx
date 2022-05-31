import axios from "axios";
import { useState } from "react";
import PopupWindow from "../../components/PopupWindow"
import styles from "../../styles/Checkout.module.css"

export default function integracoes(){

    var [loading, SetLoading] = useState (<></>)

    async function loginBling() {
        SetLoading(LoadingAnimation("Fazendo Login - Bling"))

        var config = {
            method: 'get',
            url: `/api/integracoes/bling/login_bling`
        };
        
        await axios (config)

        SetLoading(<></>)
    
    }

    async function update(){

        SetLoading(LoadingAnimation("Importando pedidos - Supra"))
        var config = {
            method: 'get',
            url: `/api/syncsupra`
        };
        
        await axios (config)
        SetLoading(LoadingAnimation("Importando pedidos - Bling"))

        var config = {
            method: 'get',
            url: `/api/syncbling`
        };
        
        await axios (config)

        SetLoading(<></>)

    }

    function LoadingAnimation(texto){

        return (
            <PopupWindow  style={
                {
                    "display":"flex",
                    "justifyContent":"center",
                    "marginTop": "30vh"
            
                }
            }  width={"auto"} className={styles.popupconfirm}  id="next_order" tabIndex={2}>
                
                <div className={styles.loader}></div>
                <div style={
                    {
                        "fontSize":"4vw",
                        "color": "white",
                        "margin": "2vw"
                                        
                    }
                }>{texto}</div>

            </PopupWindow>
        )
    }

    return (

        <main>
            
            <div>
                <div style={{fontSize: "30px"}}>Atualizar Pedidos</div>
                <button style={{margin: "30px"}} onClick={loginBling}>Login - Bling</button>
                <button onClick={update}>Importar</button>
            </div>

            {loading}
        </main>
            

    )

}