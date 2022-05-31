import { useEffect, useState } from "react";
import styles from "../../../styles/Romaneio.module.css";

import axios from "axios";

import Link from "next/link";

export default function CheckoutView() {
    var [orderProdList, SetOrderProdList] = useState(<></>)

    async function GetAllOrders(){

        var config = {
            method: 'get',
            url: `/api/packing_list`
        };

        await axios (config)
        .then(function (response) {

            const orders = response.data

            document.getElementById("contagem").innerHTML = `Restam ${orders.length} ordens`

            var listItems = []

            for (var i in orders){
                
                // console.log(orders)

                var status, description = ""

                if (orders[i].status === 0){
                   
                    status = "Pendente"
                }
                if (orders[i].status === 1){
                   
                    status = "Verificado"
                }
                else if (orders[i].status === 2){
                    status = "Concluído"
                }

                if(orders[i].description === null){
                    description = ""
                }

                listItems.push(
                    
                    <Link href={`expedicao/checkout/${orders[i].id}/`} passHref >
                        <tr key={i}>
                            <td>{orders[i].id}</td> 
                            <td>{status}</td>
                            <td>{orders[i].description}</td>
                            <td>{orders[i].created_date} </td>
                        </tr>
                    </Link>

                )
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
                                            <th>id</th>
                                            <th>status</th>
                                            <th>description</th>
                                            <th>created_date</th>
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
