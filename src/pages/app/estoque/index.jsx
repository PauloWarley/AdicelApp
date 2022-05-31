import { useEffect, useState } from "react";
import styles from "../../../styles/Romaneio.module.css";

import axios from "axios";

export default function CheckoutView() {
    var [orderProdList, SetOrderProdList] = useState(<></>)


    async function GetAllOrders(){

        var config = {
            method: 'get',
            url: `/api/get_volume/`
        };

        await axios (config)
        .then(function (response) {

            const orders = response.data

            document.getElementById("contagem").innerHTML = `Restam ${orders.length} ordens`

            var listItems = []

            for (var i in orders){
                
                console.log(orders)

                for (var j in orders[i].Modelo){
                    listItems.push(
                        <tr key={i}>
                            <td>{orders[i].ID}</td> 
                            <td>{orders[i].Modelo[j]}</td> 
                            {/* <td>{orders[i].Volume}</td> */}
                        </tr>
                    )
                }
            }
    
            SetOrderProdList(listItems)

        })
    }


    useEffect( () => {

        GetAllOrders()

    },[])
    
    return (

        <main tabIndex={0} id="main" style={{

            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

        }}>

            <div style={{

                display: "flex",
                alignItems: "center",
                flexDirection: "column"

            }}>
                <div style={{
                    
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                }}>
                    <h1 style={{paddingRight:"30px"}}>Checkout</h1>
                </div>
                
            </div>
            
            <div>
                <div style={{
                    width:"100vw",
                    display:"flex",
                    alignItems: "center",
                    flexDirection: "column"

                }}>
                    <div style={{
                        
                        display:"flex",
                        alignItems: "center",
                        flexDirection: "row"

                    }}>
                        <div className={styles.contagem}>

                            <h1 id="contagem" style={{margin: "10px"}}></h1>

                        </div>

                        <div className={styles.tableList}>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Modelo</th>
                                            <th>Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderProdList}
                                    </tbody>    
                                </table>
                            </div>
                            
                            

                    
                        </div>

                        <div style={{

                            marginLeft:"10px",
                            width:"10vw",
                            height:"auto",
                            background: "#444",
                            borderRadius: "10px"
                            
                        }}>

                        </div>

                    </div>

                </div>
            </div>
 

        </main>
    )

}
