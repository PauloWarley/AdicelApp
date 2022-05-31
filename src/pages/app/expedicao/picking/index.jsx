import { useEffect, useState } from "react"
import ReactDOMServer from 'react-dom/server'

import ReactJSBarcode from 'react-jsbarcode';

import styles from "../../../../styles/PickingV2.module.css"

import PopupWindow from "../../../../components/PopupWindow"
import { useRouter } from "next/router";

var axios = require('axios');

export default function Picking(){


    var [table, setTable] = useState("")
    var [barcode, setBarcode] = useState("")
    var [popupPage, setPopupPage] = useState("")
    var [confirmView, setConfirmView] = useState("")

    // suportewms@adicel
    // Suporte123!

    var pedidosParaCaixas
    
    var currentFilterLote = ""

    var idInFocus = "command_input"

    const router = useRouter()
 

    function sortByLocate(values){

        var ar = values.sort(function(a, b)
        {
            var nA = a
            var nB = b

            if(nA < nB)
                return -1;
            else if(nA > nB)
                return 1;
            return 0;
        })

        return ar
    }

    function page(){

        return (

            <div>

                <div 
                    style={{
                        margin:"50px", 
                        display:"flex", 
                        flexDirection:"row",
                        width: "100vw",
                        justifyContent:"center"  
                    }}>

                    <div style={{
                        marginRight:"70px",
                        marginLeft: "20px"
                    }}>

                    </div>
                </div>

            <div >
                <div style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "none"
                    
                    }}   id="tabela">
                    <table> 
                        <tbody>
                            {table}
                        </tbody>
                        
                    </table>
                </div>    
            </div>

            </div>

        )


    }

    function genCodeBar(pedido){    

        setBarcode(<ReactJSBarcode value={pedido.id} options={{
            format: 'code128',
            
            width: 2.2,
            height: 45,
            displayValue: false,
            fontOptions: "",
            font: "monospace",
            textAlign: "center",
            textPosition: "bottom",
            textMargin: 0,
            fontSize: 12,
            background: "#ffffff",
            lineColor: "#000000",
            margin: 0,
            marginTop: 0,
            marginBottom: undefined,
            marginLeft: undefined,
            marginRight: undefined
            
        }} renderer="svg" />
        )

        var rotas = {
            "ECT - Empresa Brasileira de Correios e Telégrafos":1,
            "Shopee": 1,
            "IntegraCommerce":1,
            "ViaVarejo":1,
            "SkyHub":1,
            "Amazon":1,
            "MercadoLivre":2,
            "Mandaê Serviço de Consultoria de Logística":3,
            "TEX COURIER LTDA":4

        }

        // console.log(pedido)

        var pedidoFormatado = pedido.dataPedido.substring(0,10)

        pedidoFormatado = `${pedidoFormatado.substring(8,10)}-${pedidoFormatado.substring(5,7)}-${pedidoFormatado.substring(0,4)}`

        // console.log(pedidoFormatado)

        
        return (ReactDOMServer.renderToString(
            <svg
                width="120mm"
                height="20mm"
                xmlns="http://www.w3.org/2000/svg"
                baseProfile="tiny"    
            >
                <g
                fill="none"
                stroke="#000"
                fillRule="evenodd"
                strokeLinecap="square"
                strokeLinejoin="bevel"
                >
                <path d="M8 8h378v76H8V8" fill="#fff" stroke="none" />
                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={0}
                    y={15}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`${pedido.origem}`}
                </text>
                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={0}
                    y={60}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`${pedidoFormatado}`}
                </text>
                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={0}
                    y={40}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`${pedido.pedidoOrigem}`}
                </text>

                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={90}
                    y={13}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`NF:${pedido.nfOrigem ?? ""}`}
                </text>

                <svg x={90} y={20}>
                    <div id="codebar">{barcode}</div>
                </svg>


                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={250}
                    y={15}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`Pedido WMS: ${pedido.id}`}
                </text>
                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={250}
                    y={40}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`Volume: ${pedido.volume}`}
                </text>
                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={250}
                    y={60}
                    fontFamily="Times New Roman"
                    fontSize={18}
                    fontWeight={400}
                    fill="#000"
                >
                    {`Embalagem: ${pedido.embalagem}`}
                </text>


                <text
                    stroke="none"
                    xmlSpace="preserve"
                    x={410}
                    y={50}
                    fontFamily="Times New Roman"
                    fontSize={70}
                    fontWeight={400}
                    fill="#000"
                >
                    {`${ rotas[pedido.transportadora] || rotas[pedido.origem] || "Não identificado"}`}
                </text>
            
                </g>
            </svg>

            )
        )


    }

    async function GenTags() {

        //Pega a lista de pedidos a partir de uma variavel de escopo global
        
        var pedidos = pedidosParaCaixas

        //############# DEFINE OS IFRAME QUE RECEBERÁ O CONTEUDO DE IMPRESSÃO #############
        var pri = document.getElementById("ifmcontentstoprinttag").contentWindow;
        pri.document.open();

        //############# FAZ A PAGINA QUEBRAR NO MOMENTO DA IMPRESSÃO #############
        pri.document.write(`
        <head>
            <style>
                body {
                    page-break-before: always;
                }
            </style>
        </head>`
        )

        pri.document.write('<body>');

        //############# INSERE O BARCODE NO SVG REMOVENDO UMA DIV #############


        var pedido = {
            id: 12,
            dataPedido: "12/12/2020",
            volume: "01/01",
            origem: "Bling",
            pedidoOrigem: "18321",
            nfOrigem: "18321",
            embalagem: ""
        }

        var etiqueta, j

        // pedidos = [pedidos[0]]

        for (var i in pedidos){

            j = i

            var config = {
            method: 'get',
            url: `/api/get_list_caixas/?id=${pedidos[i]}`,
            };
    
            await axios(config)
            .then(async function (response) {

                var dadosEmbalagem = response.data

                var config = {
                method: 'get',
                url: `/api/get_order/${pedidos[j]}`,
                };
        
                await axios(config)
                .then(async function (response) {

                    var dadosPedido = response.data

                    for (var vol = 0; vol < dadosEmbalagem[1].Volume; vol ++){
                        console.log(dadosPedido[0])
                        
                        pedido.embalagem = dadosEmbalagem[1].Modelo[vol]

                        pedido.id = pedidos[i]

                        pedido.dataPedido = dadosPedido[0].data

                        pedido.nfOrigem = dadosPedido[0].N_NFe

                        //Default Bling por enquanto
                        pedido.origem = dadosPedido[0].Loja

                        pedido.transportadora = dadosPedido[0].Transportadora
                    
                        pedido.pedidoOrigem = dadosPedido[0].ID_pedido

                        pedido.volume = `${vol+1}/${dadosEmbalagem[1].Volume}`

                        genCodeBar(pedido)

                        function delay(delayInms) {
                            return new Promise(resolve => {
                              setTimeout(() => {
                                resolve(2);
                              }, delayInms);
                            });
                          }
                        
                        await delay(1);


                        etiqueta = `<div>${genCodeBar(pedido)}</div>`.replace('<div id="codebar"></div>', document.getElementById("barcode_rendered").innerHTML)
            
                        pri.document.write(etiqueta)

                        

                       
                    }   

                })
                .catch(function (error) {
                    // console.log(error);
                });    


            })
            .catch(function (error) {
                // console.log(error);
            });    
        
    
 
        }

        pri.document.write('</body>');
        
        pri.document.close()

        // console.log(document.getElementById("ifmcontentstoprinttag"))

        pri.focus();

        pri.print()

        
    }

    async function postRomaneio(){
        var pedidos = pedidosParaCaixas
        // console.log("postRomaneio", pedidos)

        // Muda estado para Em Separação
        var idSituacaoBling = 48047
        var idSituacaoDB= 2

        for (var i in pedidos){

            await changeStateOnBling(pedidos[i], idSituacaoBling)
            await updateStateOnDB (pedidos[i], idSituacaoDB)

        }

        
        await GerarRomaneio() 

        async function GerarRomaneio() {

            // Gerar o romaneio

            
            var data = JSON.stringify({
                "orders": pedidos
            });
    
            var config = {
            method: 'post',
            url: `/api/packing_list`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };

            var idRomaneio = (await axios(config)).data.idRomaneio
    
            router.push(`/app/expedicao/checkout/${idRomaneio}`)

        }

    }

    async function CriaPDF() {

    
        var minhaTabela = document.getElementById('tabela').innerHTML;


        var style = "<style>";
        style = style + "table {width: 100%;font: 20px Calibri;}";
        style = style + "table, th, td {white-space: nowrap; border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "</style>";

        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        
        pri.document.write('<html><head>');
        pri.document.write('<title>Picking</title>');
        pri.document.write(style);   
        pri.document.write('</head>');
        
        pri.document.write('<body>');
        
        pri.document.write(`<h1>${currentFilterLote}</h1>`);
        pri.document.write(minhaTabela);
        pri.document.write('</body></html>');
        
        pri.document.close()

        document.querySelector("iframe").addEventListener( "load", printOnLoad);

        async function printOnLoad(){

            pri.focus();
            pri.print();
            document.querySelector("iframe").removeEventListener( "load", printOnLoad );
            pri.document.clear()

        }
    }

    function table_lista(currentFilterLote){

        var lista = []

        var query_search

        switch(currentFilterLote){

            case "Mercado Livre":
                query_search = `loja=MercadoLivre&transportadora=`
                break
            case "Correios":
                // query_search = `loja=IntegraCommerce&transportadora=`
                query_search = `loja=IntegraCommerce&transportadora=ECT - Empresa Brasileira de Correios e Telégrafos`
                // query_search = `loja=&transportadora=ECT - Empresa Brasileira de Correios e Telégrafos`
                break
            case "Mandaê":
                query_search = `loja=&transportadora=Mandaê Serviço de Consultoria de Logística`
                break
            case "Total Express":
                query_search = `loja=&transportadora=TEX COURIER LTDA`
                break
            case "Transportadora Americana":
                query_search = `loja=&transportadora=Transportadora Americana LTDA`
                break
            case "Transportadora Direcional":
                query_search = `loja=&transportadora=DIRECIONAL TRANSPORTE E LOGISTICA LTDA`
                break
            case "Adicel":
                query_search = `loja=&transportadora=Adicel`
                break
            default:
                query_search = `loja=&transportadora=`
                break

        }

        
        var config = {
            method: 'get',
            url: `/api/get_list_picking?${query_search}`
        };

        axios (config)
        .then(async function (response) {
            
            var produtos = response.data[0]
            var pedidos = response.data[1]

            pedidosParaCaixas = pedidos

            var productSorted = []

            // console.log(produtos)
            


            for (const property in produtos){
            
                productSorted.push(produtos[property].Localizacao)

            }

            productSorted = sortByLocate(productSorted)

            // console.log(productSorted)

            var productSortedList = []

            for ( var j in productSorted){

                for ( var i in produtos){

                    if (produtos[i].Localizacao === productSorted[j]){
                        productSortedList.push(produtos[i])
                    }
                    
                }
            }

            // console.log(productSortedList)

            produtos = productSortedList

            var listItems = []
            
            listItems.push(

                <tr>
                     <td>Pedido</td>
                     <td>Código</td>
                     <td>Descrição</td>
                     <td>Quantidade</td>
                     <td>Localização</td>
                </tr>

            )

            for (const property in produtos){

                listItems.push(
                    <tr key={property}>
                         <td>{produtos[property].id}</td>
                         <td>{produtos[property].ID_produto}</td>
                         <td>{produtos[property].Descricao}</td>
                         <td>{produtos[property].Quantidade}</td>
                         <td>{produtos[property].Localizacao}</td>
                         {/* <td>{produtos[property].Loja}</td>
                         <td>{produtos[property].Transportadora}</td> */}
                    </tr>
                )
            }



            var listBoxes = []

            for (var i in pedidos){

                var config = {
                    method: 'get',
                    url: `/api/get_list_caixas/?id=${pedidos[i]}`,
                };
        
                var dadosEmbalagem = (await axios(config)).data

                listBoxes.push(dadosEmbalagem[1].Modelo)
            }

            console.log(listBoxes)

            var listBoxesQntd = {}

            for (var i in listBoxes){
                if (listBoxesQntd[listBoxes[i]] === undefined){
                    listBoxesQntd[listBoxes[i]] = 1
                }
                else{
                    listBoxesQntd[listBoxes[i]] = listBoxesQntd[listBoxes[i]] + 1
                }
            }

            var boxNames = Object.keys(listBoxesQntd)

            for (var i in boxNames){

                var boxQNTD = listBoxesQntd[boxNames[i]]

                

                listItems.push(
                    <tr key={"box"+i}>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{boxNames[i]}</td>
                        <td>{boxQNTD}</td>
                        <td>{}</td>
                    </tr>
                )
            }


            setTable(listItems)

        })
    }

    async function updateStateOnDB(idPedido, idSituacao){

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
    
            await axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                // console.log(error);
            });    

    }

    
    async function changeStateOnBling(idPedido, idSituacao){

        // console.log(idPedido, idSituacao)

        // return

        var config = {
            method: 'get',
            url: `/api/get_order/${idPedido}/?situacao=["Pendente"]`
        };

        await axios (config)
        .then(function (response) {
            
            console.log('response["data"][0].ID_pedido', response["data"])

            var pedido = response["data"][0].ID_pedido

                
            var data = JSON.stringify({
                "idPedido": pedido,
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
                    // console.log("Bling", JSON.stringify(response.data));
                })
                .catch(function (error) {
                    // console.log(error);
                }) 
        
            })

    }


    function auxiliar(){
        return (

            <div tabIndex={1}>
                <div style={{display:"none"}} id="barcode_rendered">
                    {barcode}
                </div>

                <iframe style={{display:"none"}} id="ifmcontentstoprint"></iframe>
                <iframe style={{display:"none"}} id="ifmcontentstoprinttag"></iframe>
                
            </div>
        )
    }

    function selectPickingList (){
        
        try{
            var value = document.getElementById("command_input").value
        }
        catch{
            var value = ""
        }
            

        var comandos =  {
            "0009001000" : "Em falta",
            "0008001000" : "Mercado Livre",
            "0008002000" : "Correios",
            "0008003000" : "Mandaê",
            "0008004000" : "Total Express",
            "0008005000" : "Transportadora Americana",
            "0008006000" : "Transportadora Direcional",
            "0008007000" : "Adicel"
        }

        // console.log(comandos[value])

        // currentFilterLote = comandos[value]

        /* Abre o Pop-Up Passando o nome do romaneio selecionado */

        // console.log(Popup(comandos[value]))

        try{
            document.getElementById("command_input").setAttribute("id", "command_input_main_inactive")
        }
        catch{
            // var value = ""
        }
            
        setPopupPage (Popup(comandos[value]))

        table_lista(comandos[value])

    }

    function Popup(romaneio){


        function close(){
            setPopupPage("")
            document.getElementById("command_input_main_inactive").setAttribute("id", "command_input")
        }

        function close_confirm(){

            document.getElementById("command_input_popup_inactive").setAttribute("id", "command_input")

            setConfirmView("")
        }

        function next_page(){
            
            router.push("/app/expedicao/checkout")
        }

        function confirm_view(){


            return(
                <PopupWindow tabIndex={-1} style={{width:"350px", zIndex: "10"}} className={styles.popupconfirm} close={close_confirm} id="confirm_popup">
                    <div style={{margin:"10px",fontSize: "30px"}}>Impresso com Sucesso?</div>

                    <div style={
                        {
                            "display": "flex", 
                            "flexDirection":"row", 
                            "justifyContent": "space-between",
                            "margin": "0px 60px"
                        }
                    }>
                        <h1 style={{"borderRadius": "10px" ,"border": "3px solid #002631", "padding":"10px", "backgroundColor": "#57f5c0"}}>Sim</h1>
                        <h1 style={{"borderRadius": "10px" ,"border": "3px solid #002631", "padding":"10px", "backgroundColor": "#d36262"}}>Não</h1>
                        
                    </div>

                    <input style={{"fontSize": "25px", "margin": "5px"}} id="command_input" type="text" placeholder="Comando..." onKeyPress={async function (e) {
                        if (e.charCode === 13) {    
                            
                            if (e.target.value === "1"){
                                // console.log("Fechando Romaneio!")
                                await postRomaneio()

                                
                            }
                            else if (e.target.value === "0"){
                                // console.log("Reimpressão!")

                                document.getElementById("popup_item2").setAttribute("style", "display: block")
                                document.getElementById("popup_item3").setAttribute("style", "display: block")
                                document.getElementById("popup_item4").setAttribute("style", "display: block")

                                close_confirm()

                            }

                            // console.log(e.target.value)

                            e.target.value = ""
                            
                            }
                        }
                    }/>
                </PopupWindow>
            )

        }



        return (
            <PopupWindow tabIndex={0} style={
                {
                    backgroundColor: "white", 
                    color: "#181a1b", 
                    width:"500px",
                    borderRadius: "10px",
                    boxShadow: "inset 0 0 1em",
                    bottom: "calc(50%)",
                    left: "calc(50% - 250px)",
                    zIndex: "10"


                } 
                } close={close} id="popup">

                <div>
                    <div> 
                        <h1>{romaneio}</h1>

                        <h2>Início de um nova jornada!</h2>

                        <ul style={{'listStyleType': 'none',   'margin': '0',
                                    'padding': '0'}}>

                            <li id="popup_item1">(1) - Iniciar Impressões</li>
                            <li style={{display: "none"}} id="popup_item2">(2) - Imprimir Etiquetas de Caixa</li>
                            <li style={{display: "none"}} id="popup_item3">(3) - Imprimir Relatório de Separação</li>
                            <li style={{display: "none"}} id="popup_item4">(4) - Fechar o Romaneio</li>

                        </ul>

                        


                    </div>

                    <input style={{"margin": "10px"}} id="command_input" type="text" placeholder="Comando..." onKeyPress={ async function(e) {

                            
                            if (e.charCode === 13) {    
                                
                                // console.log("Impressões")
                                
                                if (e.target.value === "1"){
                                    await GenTags()
                                    await CriaPDF()
                                    document.getElementById("command_input").setAttribute("id", "command_input_popup_inactive")
                                    setConfirmView (confirm_view())
                                }

                                 else if (e.target.value === "2" && document.getElementById("popup_item2").getAttribute("style") != "display: none;"){

                                    await GenTags()
                                    try{
                                        document.getElementById("command_input").setAttribute("id", "command_input_popup_inactive")
                                    }
                                    catch{}
                                    setConfirmView (confirm_view())
                                }
                                else if (e.target.value === "3" && document.getElementById("popup_item3").getAttribute("style") != "display: none;"){
                                    await CriaPDF()
                                    document.getElementById("command_input").setAttribute("id", "command_input_popup_inactive")
                                    setConfirmView (confirm_view())
                                }
                                else if (e.target.value === "4" && document.getElementById("popup_item4").getAttribute("style") != "display: none;"){
                                    // console.log("Fechando Romaneio Manualmente")
                                    await postRomaneio()
  
                                }

                                e.target.value = ""
                            }
                        }
                    }/>

                    

                </div>

            </PopupWindow>
        )

    }

    function TutorialPage(){

        return (

            <div tabIndex={2} style={
                {
                    "width": "auto", 
                    "height": "90vh", 
                    "backgroundColor": "#fff",
                    "color": "#2d3236",
                    "margin": "0 50px"
                }
            }>

            </div>

        )
        
    }

    useEffect (() => {

        try{
            document.getElementById(idInFocus).focus()
        }
        catch{

        }

    })

    useEffect (() => {

        selectPickingList()

    }, [])

    

    return(

        <main id="main">

            {TutorialPage()}            

            <div>
                <input className={styles.input} placeholder="Comando..." type="text" name="command_input" id="command_input" onKeyPress={(e) => {
                        if (e.charCode === 13) {    

                            selectPickingList()

                            e.target.value = ""
                            
                        }
                    }
                } />
            </div>

            
            {popupPage}
            {confirmView}

            {auxiliar()}
            {page()}

            
  
        </main>

    )

}
