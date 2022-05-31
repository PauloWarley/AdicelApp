import { useEffect, useState } from "react";
import styles from "../../../../styles/Checkout.module.css"

import axios from "axios";

import PopupWindow from "../../../../components/PopupWindow"

import { useRouter } from "next/router";

export default function CheckoutView() {

    var [searchInput, SetSearchInput] = useState("0")
    var [searchInputFunction, SetSearchInputFunction] = useState("Caixa")
    var [time, setTime] = useState("00:00:00")
    var [orderId, SetOrderId] = useState("")
    var [orderProdList, SetOrderProdList] = useState("")

    var [listaDeProdutos, SetListaDeProdutos] = useState("")

    var inputInFocus = "input_text"
    
    var [loading, setLoading] = useState(<></>)

    var [finish, setFinish] = useState("")

    const router = useRouter()  

    var {
        query: { id },
    } = router

    /* Checkout */
    
    async function GetAllOrders(){

        
        var config = {
            method: 'get',
            url: `/api/get_order/?situacao=["Em separação"]&romaneio=${id}`,
        };

        await axios (config)
        .then(function (response) {

            const orders = response.data
            
            console.log("currentOrder", orders.length)

            document.getElementById("contagem").innerHTML = `Restam ${orders.length} ordens`

            if (orders.length === 0){
                setFinish(PickingListComplete())
            }
        })
    }

    function SearchOrder(){
    
        console.log(searchInput)


        if (searchInput === "%#5#%"){
            searchInput = "00"
        }

        var config = {
            method: 'get',
            url: `/api/get_order/${searchInput}/?situacao=["Em separação"]&romaneio=${id}`
        };

        axios (config)
        .then(function (response) {

            const currentOrder = response.data

            // console.log(currentOrder)
            if (currentOrder.length === 0){
                console.log("Pedido não está em separação!")
            }
            
            if (currentOrder.length != 0){

                loadList(currentOrder)
    
                SetListaDeProdutos(currentOrder)

            }

        })
    }

    async function loadList(currentOrder){

        SetSearchInputFunction("Item")

        var productListAux = []

        var productExist = false


        for (var i in currentOrder){

            SetOrderId(`Nº  ${currentOrder[i].id}`)

            //Trata pedidos com Falta de produtos

            var pedidoEmQuebra = false

            if (searchInput === "%#5#%"){
                
                pedidoEmQuebra = true

            }

            console.log("searchInput",searchInput)

            console.log(currentOrder[i])
            if ((currentOrder[i].GTIN === searchInput || currentOrder[i].ID_produto === searchInput) && currentOrder[i].Quantidade > 0){
                
                productExist = true

                var audio = new Audio(
                    `/api/sound/?state=true`);
                audio.play();

                currentOrder[i].Quantidade = currentOrder[i].Quantidade -1

            }



            if (currentOrder[i].Quantidade > 0){

                productListAux.push(
                    // 
                    `${currentOrder[i].ID_produto} - ${currentOrder[i].Descricao} (${currentOrder[i].Quantidade}x)`
                    
                )
            }

        }


        if(!productExist){
            var audio = new Audio(
                `/api/sound/?state=false`);
            audio.play();
        }

    

        const listItems = productListAux.map((item) =>
            {
                return(
                    <li key={item}>{item}</li>
                )

            }
            );


        SetOrderProdList(listItems)
        console.log(productListAux.length)



        

        if (!pedidoEmQuebra && productListAux.length === 0){

            var idSituacao = "51976"

            console.log("Troca de Pedido")

            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

            document.getElementById("orderId").innerText = ""

            updateStateOnDB(currentOrder[0].id, 3)

            changeStateOnBling(currentOrder[0].ID_pedido, idSituacao)

            SetSearchInputFunction("Caixa")
            


            setLoading(LoadingAnimation())
            await sleep(5000)
            setLoading(<></>)

            await GetAllOrders()

        }

        //Se for um pedido em quebra o usuario pode avisar em qualquer momento

        //O pedido vai para o estado de "Em falta"

        if (pedidoEmQuebra){

            console.log("quebra", currentOrder[0].id)
            //Em falta no Bling
            var idSituacao = "49012"
            
            console.log("Troca de Pedido")

            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

            document.getElementById("orderId").innerText = ""

            updateStateOnDB(currentOrder[0].id, 5)

            changeStateOnBling(currentOrder[0].ID_pedido, idSituacao)

            SetSearchInputFunction("Caixa")

            setLoading(LoadingAnimation())
            await sleep(5000)
            setLoading(<></>)

            SetOrderProdList("")

            await GetAllOrders()
        }

        
    }

    function updateStateOnDB(idPedido, idSituacao){

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

    function changeStateOnBling(idPedido, idSituacao){
        // return

        var data = JSON.stringify({
        "idPedido": idPedido,
        "idSituacao": idSituacao
        });

        var config = {
        method: 'put',
        url: '/api/integracoes/bling',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        }; 

        axios(config)
        .then(function (response) {
            console.log("Bling", JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });



    }

    function inputFunctionBox (){

        if (searchInputFunction === "Caixa"){
            return(
                <input id="input_text" type="text" placeholder="Escaneie uma caixa..." 
                onChange={(e) => SetSearchInput(e.target.value)} 
                
                onKeyPressCapture={(e) => {
                    // console.log("---------", e.target.value)
                    if (e.charCode === 13 && e.target.value != "") {
                        
                        SearchOrder();
                        e.target.value = ""  
                    }
                }}
                />
            )
        }

        else if(searchInputFunction === "Item"){

            return(
                <input id="input_text" type="text" placeholder="Escaneie um item..." 
                onChange={(e) => SetSearchInput(e.target.value)} 
                
                onKeyPressCapture={(e) => {
                    // console.log("---------", e.target.value)
                    if (e.charCode === 13 && e.target.value != "") {
                        
                        // SearchOrder();
                        loadList(listaDeProdutos)
                        e.target.value = ""  
                    }
                }}
                />
            )

        }

    }

    function LoadingAnimation(){

        inputInFocus = "main"
        
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
                }>Pedido Concluído com Sucesso!</div>

            </PopupWindow>
        )
    }

    function PickingListComplete(){

        var data = JSON.stringify({
        });

        var config = {
        method: 'put',
        url: `/api/packing_list/?id=${id}`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then(function (response) {

            var porcetagem_separada = 
                `${(response.data.orderQntd - response.data.missingOrderQntd)*100/response.data.orderQntd}`

            document.getElementById("separacao_porcentagem").innerText = `${Math.round(porcetagem_separada*100)/100}%`
  
            document.getElementById("separacao_tempo").innerText = response.data.timeInHours
            document.getElementById("qntd_pedidos").innerText = response.data.orderQntd
            document.getElementById("ranking").innerText = 1
            document.getElementById("qntd_em_falta").innerText = response.data.missingOrderQntd
            document.getElementById("qntd_produtos").innerText = response.data.productQntd

        })
        .catch(function (error) {
            console.log(error);
        });   
        
        async function gotoNextPage(){

            await axios.put(`/api/packing_list/?id=${id}&status=checked`)

            next_page()

        }
            
    
        return (
            <PopupWindow style={
                {
                    backgroundColor: "#2b2f31",
                    color: "white",
                    width: "50%",
                    height: "50vh",
                    margin: "10% 25vw",
                    borderRadius: "10px",
                    
                }
            } id="next_order" tabIndex={-1}>

                <div style={
                        {
                            display: "flex",
                            flexDirection: "column",
                            fontSize: "24px",
                            alignItems: "center",
                            justifycontent: "center",
                            
                        }
                    }>
                    <div style={
                        {
                            display: "flex",
                            flexDirection: "row",
                            fontSize: "24px",
                            
                        }
                    }>

                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "10% 10px",
                            }
                        }> 
                            <b id={'separacao_porcentagem'} style={{fontFamily: "PT Mono"}}>100%</b>
                            <p style={{color: "#bbb", fontSize: "20px"}}>Separação</p>
                        </div>

                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "10% 10px",
                            }
                        }> 
                            <b id={'qntd_pedidos'} style={{fontFamily: "PT Mono"}}>8</b>
                            <p style={{color: "#bbb", fontSize: "20px"}}>Pedidos</p>
                        </div>

                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "10% 10px",
                            }
                        }> 
                            <b id={'qntd_produtos'} style={{fontFamily: "PT Mono"}}>40</b>
                            <p style={{color: "#bbb", fontSize: "20px"}}>Produtos</p>
                        </div>

                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "10% 10px",
                            }
                        }> 
                            <b id={'qntd_em_falta'} style={{fontFamily: "PT Mono"}}>0</b>
                            <p style={{color: "#bbb", fontSize: "20px"}}>Em falta</p>
                        </div>

                        

                    </div>
                    
                    <div style={
                        {
                            display: "flex",
                            flexDirection: "row",
                            fontSize: "30px",
                            
                        }
                    }>

                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "5% 10px",
                                // fontSize: "24px"
                            }
                        }> 
                            <b id={'separacao_tempo'} >1:20:05</b>
                            <p style={{color: "#bbb", fontSize: "24px"}}>Tempo</p>
                        </div>
                        
                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                margin: "5% 20%",
                                // fontSize: "24px"
                            }
                        }> 
                            <b id={'ranking'}>1</b>
                            <p style={{color: "#bbb", fontSize: "24px"}}>Ranking</p>
                        </div>  

                       

                    </div>

                    <input style={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "center",
                        width: "50%",
                        textAlign: "center"
                    }} id="input_text_complete" type="text" placeholder="Comando..." 
                        onChange={(e) => SetSearchInput(e.target.value)} 
                        
                        onKeyPressCapture={(e) => {
                            // console.log("---------", e.target.value)
                            if (e.charCode === 13 && e.target.value != "") {
                                
                                gotoNextPage()
                                e.target.value = ""  
                            }
                        }}
                    />

                </div>
            
            </PopupWindow>
        )
    }


    function next_page(){
            
        router.push(`/app/expedicao/etiquetas/${id}`)
    }

    function startTime() {
        const today = new Date()
        let h = today.getHours()
        let m = today.getMinutes()
        let s = today.getSeconds()
        m = checkTime(m)
        s = checkTime(s)

        setTime(`${h}:${m}:${s}`)

        setTimeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {i = "0" + i};
        return i;
    }

    useEffect( () => {
        startTime()
                
        if (document.getElementById("next_order") === null){
            document.getElementById(inputInFocus).focus();
        }
        if (document.getElementById("input_text_complete") != null){
            document.getElementById("input_text_complete").focus();
        }

    } )

    useEffect(() =>{
        if(!router.isReady) return;

        GetAllOrders()

    }, [router.isReady]);
    
    return (

        <main tabIndex={0} id="main" style={{

            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

        }}>
            {/* {LoadingAnimation()} */}

            {loading}

            {finish}

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
                    <h1>{time}</h1>
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
                        <div style={{

                            marginRight:"100px",
                            width:"auto",
                            height:"auto",
                            background: "#444",
                            borderRadius: "10px"

                            }}>

                            <h1 id="contagem" style={{margin: "10px"}}></h1>
                            <div><h2 id="orderId">{orderId}</h2></div>
                            
                            
                        </div>

                        <div className={styles.Checkout}>


                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "center",
                            }}>

                                {inputFunctionBox()}

                                <ul style={{  
                                    listStyleType: "none",
                                    margin: "10px",
                                    padding: "0"
                                }}>
                                    {orderProdList}
            

                                </ul>
 
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
