import axios from "axios"
import { useEffect, useState } from "react"
import ReactDOMServer from 'react-dom/server'

import styles from "../../../styles/PickingV2.module.css"

import PopupWindow from "../../../components/PopupWindow"

export default function Picking(){


    var [table, setTable] = useState("")
    var [buttonPrint, setButtonPrint] = useState("")
    var [popupPage, setPopupPage] = useState("")
    var [confirmView, setConfirmView] = useState("")

    var pedidosParaCaixas
 
    var currentFilterLote = ""

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

                {/* <h1>Picking</h1> */}

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
                        {/* <input type="button" value="Gerar Lista" id="btnGerarLista" onClick={table_lista} /> */}

                        {/* <button onClick={() => console.log(pedidosParaCaixas)}>Gerar Romaneio</button> */}
                    </div>
                </div>

                <p style={{
                    margin:"50px", 
                    display:"flex", 
                    flexDirection:"row",
                    width: "100vw",
                    justifyContent:"center"          
                }}>
                    
                <div>
                    {buttonPrint}
                </div>

                </p>
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

    function genCodeBar(endereco){    

        
        return (ReactDOMServer.renderToString(
            <svg
                width="180mm"
                height="100mm"
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


                <svg x={30} y={10} >

                <text stroke="#000" textAnchor="start" fontFamily="Noto Sans JP" fontSize="200" id="svg_4" y="170" x="30%" fill="#000000">{endereco[0]}</text>
                <text stroke="#000" textAnchor="start" fontFamily="Noto Sans JP" fontSize="34" id="svg_5" y="200" x="0" fill="#000000">{endereco[1]}</text>
                
                </svg>

                </g>
            </svg>

            )
        )


    }

    async function genTags() {

        //Pega a lista de pedidos a partir de uma variavel de escopo global
        
        var pedidos = pedidosParaCaixas

        //Trantando um pedido multi volumes
        // pedidos = ["45"]

        // console.log("pedidosParaCaixas", pedidosParaCaixas)

        //############# DEFINE OS IFRAME QUE RECEBERÁ O CONTEUDO DE IMPRESSÃO #############
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();

        //############# FAZ A PAGINA QUEBRAR NO MOMENTO DA IMPRESSÃO #############
        pri.document.write(`
        <head>
            <style>
                div {
                    page-break-before: always;
                }
            </style>
        </head>`
        )

        //############# PEGA O BARCODE GERADO NO HTML (OCULTO) #############

        pri.document.write('<body>');

        //############# INSERE O BARCODE NO SVG REMOVENDO UMA DIV #############

        var etiqueta

        var endereco_list = [
            "E1-S2-A-A1-P1",
            "E1-S2-A-A1-P2",
            "E1-S2-A-A1-P3",
            "E1-S2-A-A2-P1",
            "E1-S2-A-A2-P2",
            "E1-S2-A-A2-P3",
            "E1-S2-A-A3-P1",
            "E1-S2-A-A3-P2",
            "E1-S2-A-A3-P3",
            "E1-S2-A-A4-P1",
            "E1-S2-A-A4-P2",
            "E1-S2-A-A4-P3",
            "E1-S2-B-A1-P1",
            "E1-S2-B-A1-P2",
            "E1-S2-B-A2-P1",
            "E1-S2-B-A2-P2",
            "E1-S2-B-A3-P1",
            "E1-S2-B-A3-P2",
            "E1-S2-B-A4-P1",
            "E1-S2-B-A4-P2",
            "E1-S2-C-A1-P1",
            "E1-S2-C-A1-P2",
            "E1-S2-C-A1-P3",
            "E1-S2-C-A2-P1",
            "E1-S2-C-A2-P2",
            "E1-S2-C-A2-P3",
            "E1-S2-C-A3-P1",
            "E1-S2-C-A3-P2",
            "E1-S2-C-A3-P3",
            "E1-S2-C-A4-P1",
            "E1-S2-C-A4-P2",
            "E1-S2-C-A4-P3",
            "E1-S2-D-A1-P1",
            "E1-S2-D-A1-P2",
            "E1-S2-D-A1-P3",
            "E1-S2-D-A2-P1",
            "E1-S2-D-A2-P2",
            "E1-S2-D-A2-P3",
            "E1-S2-D-A3-P1",
            "E1-S2-D-A3-P2",
            "E1-S2-D-A3-P3",
            "E1-S2-D-A4-P1",
            "E1-S2-D-A4-P2",
            "E1-S2-D-A4-P3",
            "E1-S2-E-A1-P1",
            "E1-S2-E-A1-P2",
            "E1-S2-E-A2-P1",
            "E1-S2-E-A2-P2",
            "E1-S2-E-A3-P1",
            "E1-S2-E-A3-P2",
            "E1-S2-E-A4-P1",
            "E1-S2-E-A4-P2",
            "E1-S2-F-A1-P1",
            "E1-S2-F-A1-P2",
            "E1-S2-F-A1-P3",
            "E1-S2-F-A2-P1",
            "E1-S2-F-A2-P2",
            "E1-S2-F-A2-P3",
            "E1-S2-F-A3-P1",
            "E1-S2-F-A3-P2",
            "E1-S2-F-A3-P3",
            "E1-S2-F-A4-P1",
            "E1-S2-F-A4-P2",
            "E1-S2-F-A4-P3"

        ]

        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
            

        for (var vol = 0; vol < endereco_list.length; vol ++){

            await sleep(50);
 
    
            console.log(vol)

            genCodeBar(endereco_list[vol])

            etiqueta = `<div>${genCodeBar(endereco_list[vol])}</div>`.replace('<div id="codebar"></div>', document.getElementById("barcode_rendered").innerHTML)

            pri.document.write(etiqueta)
        }   

 
        

        pri.document.write('</body>');
        
        pri.document.close()

        console.log(document.getElementById("ifmcontentstoprint"))

        document.getElementById("ifmcontentstoprint").addEventListener( "load", printOnLoad);

        function printOnLoad(){

            pri.focus();

            console.log("Printing")
            
            pri.print()

            document.querySelector("iframe").removeEventListener( "load", printOnLoad);

            pri.document.clear()
        }
        
    }
    
    async function genTagsProdutos() {

        //Pega a lista de pedidos a partir de uma variavel de escopo global
        
        var pedidos = pedidosParaCaixas

        //Trantando um pedido multi volumes
        // pedidos = ["45"]

        // console.log("pedidosParaCaixas", pedidosParaCaixas)

        //############# DEFINE OS IFRAME QUE RECEBERÁ O CONTEUDO DE IMPRESSÃO #############
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();

        //############# FAZ A PAGINA QUEBRAR NO MOMENTO DA IMPRESSÃO #############
        pri.document.write(`
        <head>
            <style>
                div {
                    page-break-before: always;
                }
            </style>
        </head>`
        )

        //############# PEGA O BARCODE GERADO NO HTML (OCULTO) #############

        pri.document.write('<body>');

        //############# INSERE O BARCODE NO SVG REMOVENDO UMA DIV #############

        var etiqueta

        var endereco_list = [
            [`941`, `FARINHA SOJA INTEGRAL ATIVA`],
            [`870`, `EXTRATO DE MALTE`],
            [`1104`, `AMIDO AMD21`],
            [`1088`, `AMIDO AMD11`],
            [`940`, `EXTRATO SOJA MICRONIZADA`],
            [`1213`, `AMIDO AMD20`],
            [`1209`, `AMIDO AMD10`],
            [`1211`, `AMIDO AMD12`],
            [`942`, `FARINHA SOJA INTEGRAL INATIVA`],
            [`1277`, `AMIDO AMD13`],
            [`1215`, `POLVILHO AZEDO`],
            [`1217`, `PRE MIX PARA PAO DE QUEIJO`],
            [`912`, `ALHO EM PÓ PURO`],
            [`925`, `CEBOLA EM PÓ PURA`],
            [`927`, `CEBOLA FLOCOS PEQUENOS(MIUDA )`],
            [`914`, `ALHO GRANULADO`],
            [`913`, `ALHO FLOCOS`],
            [`965`, `OREGANO PO`],
            [`964`, `OREGANO DESIDRATADO FOLHA`],
            [`926`, `CEBOLA FLOCOS`],
            [`928`, `CEBOLINHA DESIDRATADA`],
            [`938`, `CURRY`],
            [`937`, `CURCUMA/ACAFRÃO EM PO`],
            [`963`, `NOZ MOSCADA PO`],
            [`1050`, `CANELA EM PÓ PREMIUM`],
            [`969`, `PIMENTA DO REINO MOIDA PURA -`],
            [`956`, `LOURO EM PÓ`],
            [`1047`, `CRAVO EM FLOR EXTRA (SEMENTE)`],
            [`967`, `PAPRICA PICANTE`],
            [`1173`, `SAL ROSA DO HIMALAIA REFINADO -`],
            [`1166`, `SAL ROSA DO HIMALAIA GROSSO -`],
            [`946`, `GOMA XANTANA 200 MESH `],
            [`1068`, `PIMENTA BRANCA GRAO -`],
            [`997`, `PIMENTA DO REINO PRETA GRAO -`],
            [`1195`, `GOMA CARRAGENA -`],
            [`966`, `PAPRICA DOCE SC`],
            [`1108`, `PIMENTA CHILLI EM PÓ`],
            [`947`, `GOMA GUAR -`],
            [`1226`, `AROMA ID NAT BAUNILHA`],
            [`1225`, `AROMA ID NAT CHOCOLATE`],
            [`1236`, `AROMA ID NAT LEITE CONDENSADO`],
            [`1228`, `AROMA ID NAT LIMÃO`],
            [`1223`, `AROMA ID NAT MORANGO -5KG`],
            [`1267`, `CORANTE AZUL INDIGOTINA (ANIL) EM PÓ - `],
            [`1260`, `CORANTE CARAMELO EM PÓ CLASSE IV SC `],
            [`1266`, `CORANTE MARROM (CHOCOLATE) EM PÓ - `],
            [`1265`, `CORANTE VERDE (FOLHA) EM PÓ`],
            [`994`, `CORANTE VERMELHO PONCEAU EM PÓ  `],
            [`1031`, `MANJERICAO FLOCOS DESIDRATADO`],
            [`1016`, `HORTELA DESIDRATADO FLOCOS`],
            [`1197`, `GENGIBRE EM PÓ PURO`],
            [`910`, `ACUCAR MASCAVO`],
            [`1125`, `PIMENTA BRANCA MOIDA PURA -`],
            [`1073`, `GERGELIM PRETO`],
            [`930`, `CITRATO DE SODIO`],
            [`951`, `LECITINA DE SOJA PÓ ADILEC - SC`],
            [`1058`, `HEXAMETAFOSFATO DE SÓDIO`],
            [`923`, `BICARBONATO DE SÓDIO `],
            [`921`, `BENZOATO DE SODIO PO-`],
            [`920`, `BENZOATO DE SÓDIO GRANULADO. SC `],
            [`931`, `CMC - CARBOXIMETILCELULOSE`],
            [`1222`, `COLÁGENO VERISOL GELITA - SC 15KG`],
            [`1110`, `DIÓXIDO DE SILÍCIO`],
            [`1193`, `PIROFOSFATO ACIDO DE SODIO -`],
            [`961`, `NITRATO DE SODIO SC `],
            [`939`, `ERITORBATO SODIO PO`],
            [`962`, `NITRITO DE SODIO -`],
            [`906`, `ÁCIDO ASCORBICO (VITAMINA C) -`],
            [`1177`, `FRUTOSE CRISTAL`],
            [`1279`, `ISOMALTE`],
            [`869`, `POLIDEXTROSE `],
            [`977`, `SORBATO DE POTASSIO GRANULADO- `],
            [`1191`, `CARBONATO DE CALCIO -`],
            [`960`, `METABISSULFITO DE SODIO -`],
            [`922`, `BHT -`],
            [`909`, `ACIDO SORBICO -`],
            [`945`, `GLUTAMATO MONOSSÓDICO -80 `],
            [`1249`, `CREMOR DE TÁRTARO/BITARTARATO DE `],
            [`1247`, `BICARBONATO DE AMONIO -`],
            [`1046`, `PROPIONATO DE CALCIO ANTIMOFO`],
            [`1098`, `DEXTROSE MONOHIDRATADA EM PÓ `],
            [`944`, `GLUCOSE MILHO / XAROPE DE GLICOSE EM `],
            [`1281`, `FOSFATO MONOCALCICO`],
            [`1185`, `ERITRITOL`],
            [`1194`, `SACARINA SÓDICA -`],
            [`1106`, `ACIDO MALICO`],
            [`933`, `COMINHO EM PO`],
            [`868`, `XILITOL `],
            [`1176`, `GOMA ARÁBICA / ACÁCIA`],
            [`980`, `TRIPOLIFOSFATO DE SÓDIO -`]

        ]

        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
            

        for (var vol = 0; vol < endereco_list.length; vol ++){

            // await sleep(50);
 
    
            console.log(endereco_list[vol])

            etiqueta = `<div>${genCodeBar(endereco_list[vol])}</div>`

            pri.document.write(etiqueta)
        }   

 
        

        pri.document.write('</body>');
        
        pri.document.close()

        console.log(document.getElementById("ifmcontentstoprint"))

        document.getElementById("ifmcontentstoprint").addEventListener( "load", printOnLoad);

        function printOnLoad(){

            pri.focus();

            console.log("Printing")
            
            pri.print()

            document.querySelector("iframe").removeEventListener( "load", printOnLoad);

            pri.document.clear()
        }
        
    }

    async function postRomaneio(){
        var pedidos = pedidosParaCaixas
        console.log(pedidos)

        // Muda estado para Em Separação
        var idSituacaoBling = 48047
        var idSituacaoDB= 2

        for (var i in pedidos){

            updateStateOnDB (pedidos[i], idSituacaoDB)
            changeStateOnBling(pedidos[i], idSituacaoBling)

        }

        myFunction() 

        function myFunction() {
            var txt;
            if (confirm("Você confirma a geração do romaneio?")) {

                txt = "You pressed Ok!";

                var axios = require('axios');
                var data = JSON.stringify({
                    "orders": pedidos
                });
        
                var config = {
                method: 'post',
                url: `/api/insert_packing_list`,
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

            } else {
              txt = "You pressed Cancel!";
            }
            console.log(txt)
        }

        // return

        

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
        .then(function (response) {
            
            var produtos = response.data[0]
            var pedidos = response.data[1]

            pedidosParaCaixas = pedidos

            setPedidosOnPicking(<>{pedidos}</> )

            var productSorted = []

            console.log(produtos)
            


            for (const property in produtos){
            
                productSorted.push(produtos[property].Localizacao)

            }

            productSorted = sortByLocate(productSorted)

            console.log(productSorted)

            var productSortedList = []

            for ( var j in productSorted){

                for ( var i in produtos){

                    if (produtos[i].Localizacao === productSorted[j]){
                        productSortedList.push(produtos[i])
                    }
                    
                }
            }

            console.log(productSortedList)

            produtos = productSortedList

            for (const property in produtos){

                lista.push(

                    <tr>
                         <td>{produtos[property].id}</td>
                         <td>{produtos[property].ID_produto}</td>
                         <td>{produtos[property].Descricao}</td>
                         <td>{produtos[property].Quantidade}</td>
                         <td>{produtos[property].Localizacao}</td>
                         {/* <td>{produtos[property].Loja}</td>
                         <td>{produtos[property].Transportadora}</td> */}
                    </tr>

            )}

            const listItems = lista.map((item) =>
            {
                return(
                    <>{item}</>
                )

            }
            );

            
            setTable(listItems)

            if (currentFilterLote != "Escolha"){
                setButtonPrint(
                    <div>
                        <input type="button" value="Imprimir" id="btnImprimir" onClick={CriaPDF} />
                        <button onClick={() => {
                            genTags()
                        }}>Imprimir Etiquetas de Caixa</button>

                        <button onClick={() => {
                            postRomaneio()
                        }}>Gerar Romaneio</button>

                    </div>
    
                )
            }


        })
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

    
    function changeStateOnBling(idPedido, idSituacao){

        console.log(idPedido, idSituacao)

        return

        var config = {
            method: 'get',
            url: `/api/get_order/${idPedido}/?situacao=Pendente`
        };

        axios (config)
        .then(function (response) {
            
            console.log('response["data"][0].ID_pedido)', response["data"])

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
                console.log("Bling", JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            }); 
    
    
        
        })


    }


    function auxiliar(){
        return (

            <div tabIndex={1}>
                <div style={{display:"none"}} id="barcode_rendered">
                    {barcode}
                </div>
    
                <iframe style={{display:"none"}} id="ifmcontentstoprint"></iframe>
                
            </div>
        )
    }

    function selectPickingList (){
        
        var value = document.getElementById("command_input").value

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

        console.log(comandos[value])

        currentFilterLote = comandos[value]

        /* Abre o Pop-Up Passando o nome do romaneio selecionado */

        console.log(popup(comandos[value]))

        document.getElementById("command_input").setAttribute("id", "command_input_main_inactive")

        setPopupPage (popup(comandos[value]))

        table_lista(comandos[value])

    }

    function popup(romaneio){


        function close(){
            setPopupPage("")
            document.getElementById("command_input_main_inactive").setAttribute("id", "command_input")
        }

        function closeConfirm(){

            document.getElementById("command_input_popup_inactive").setAttribute("id", "command_input")

            setConfirmView("")
        }

        return (
            <PopupWindow close={close} id="popup" tabIndex={-1}>

                <div>
                    <div> 
                        <h1>{romaneio}</h1>

                        <h2>Início de um nova jornada!</h2>

                        <ul style={{'listStyleType': 'none',   'margin': '0',
                                    'padding': '0'}}>

                            <li id="item1">(1) - Impressões</li>
                            <li id="item2">(2) - Fechar o Romaneio</li>

                        </ul>

                        


                    </div>

                    <input id="command_input" type="text" placeholder="Comando..." onKeyPress={ async function(e) {

                            
                            if (e.charCode === 13) {    

                                document.getElementById("command_input").setAttribute("id", "command_input_popup_inactive")

                                console.log(e.target.value)


                                
                                

                                setConfirmView (
                                    <PopupWindow width={"350px"} className={styles.popupconfirm} close={closeConfirm} id="confirm_popup" tabIndex={-2}>
                                        <div>Impresso com Sucesso?</div>

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

                                        <input style={{"fontSize": "25px"}} id="command_input" type="text" placeholder="Comando..." onKeyPress={(e) => {
                                            if (e.charCode === 13) {    
                                                
                                                if (e.target.value === "1"){
                                                    console.log("Fechando Romaneio!")
                                                }
                                                else if (e.target.value === "0"){
                                                    console.log("Reimpressão!")
                                                }

                                                console.log(e.target.value)

                                                e.target.value = ""
                                                
                                                }
                                            }
                                        }/>
                                    </PopupWindow>
                                )
                            
                                await print()
                                await CriaPDF()
                                
                                e.target.value = ""
                                
                            }
                        }
                    }/>

                    

                </div>

            </PopupWindow>
        )

    }

    return(

        <main id="main">


            {popupPage}
            {confirmView}

            <button onClick={genTags}>Gerar</button>
            <button onClick={genTagsProdutos}>Gerar Produtos</button>


            {auxiliar()}
            {page()}
  
        </main>

    )

}
