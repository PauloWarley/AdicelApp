import axios from "axios"
import { useState } from "react"



var HOST = process.env.HOST

export default function home(){


    var [currentFilterLote, setCurrentFilterLote] = useState("Escolha")
    var [table, setTable] = useState("")

    function page(){

        return (

            <div>

                <h1>Picking Por Lote</h1>

                <div>
                    <label style={{margin:"20px"}}  htmlFor="filter-lote">Lote:</label>
                    <select name="filter-lote" id="filter-lote" onChange={e => {setCurrentFilterLote(e.target)}}>
                        <option value="0">Escolha</option>
                        <option value="1">Mercado Livre</option>
                        <option value="2">Correios</option>
                        <option value="3">Mandaê</option>
                        <option value="4">Total Express</option>
                        <option value="5">Transportadora Americana</option>
                        <option value="6">Tranportadora Direcional</option>

                    </select>
                </div>

            </div>

        )


    }

    function CriaPDF() {

        var minhaTabela = document.getElementById('tabela').innerHTML;

        var style = "<style>";
        style = style + "table {width: 100%;font: 20px Calibri;}";
        style = style + "table, th, td {white-space: nowrap; border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "</style>";

        // CRIA UM OBJETO WINDOW
        var win = window.open('', '', 'height=700,width=700');
        win.document.write('<html><head>');
        win.document.write('<title>Picking</title>');      // <title> CABEÇALHO DO PDF.
        win.document.write(style);   
        win.document.write('</head>');
        
        win.document.write('<body>');
        win.document.write(minhaTabela);                   // O CONTEUDO DA TABELA DENTRO DA TAG BODY
        win.document.write('</body></html>');
        win.document.close(); 	                           // FECHA A JANELA
        win.print();                                       // IMPRIME O CONTEUDO
    }

    function table_lista(){

        var lista = []

        var config = {
            method: 'get',
            url: `${HOST}/api/get_list_picking?loja=&transportadora=ECT - Empresa Brasileira de Correios e Telégrafos`
        };

        axios (config)
        .then(function (response) {
            
            var produtos = response.data

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


        })

        

        

    }


    return (

        <div>
            {page()}
            <p style={{margin:"50px"}}>
                <input type="button" value="Gerar Lista" id="btnGerarLista" onClick={table_lista} />
                <input type="button" value="Criar PDF" id="btnImprimir" onClick={CriaPDF} />
            </p>
            <div >
                <div style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    
                    }}   id="tabela">
                    <table> 
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Quantidade</th>
                                <th>Localização</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table}
                        </tbody>
                        
                    </table>
                </div>    
            </div>
        </div>
    )
}