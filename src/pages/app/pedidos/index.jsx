/*Checkbox desativada*/


import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../../styles/Pedidos.module.css"


export default function Pedidos(){

    var [list, setList] = useState("")
    var [filterLoja, setFilterLoja] = useState("")
    var [filterTransportadora, setFilterTransportadora] = useState("")
    
    var [currentFilterLoja, setCurrentFilterLoja] = useState("")
    var [currentFilterTransportadora, setCurrentFilterTransportadora] = useState("")
    var [currentFilterSituacao, setCurrentFilterSituacao] = useState("Pendente")
    var [currentFilterSearch, setCurrentFilterSearch] = useState("")


    function setOrderList(){

        var list = []

        var config = {
            method: 'get',
            url: `/api/get_order`
        };

        axios (config)
        .then(function (response) {

            var pedidos = response.data

            var lojas = [], transportadoras = []

            var indexTR = 0, indexLJ = 0

            var listTR = [], listLJ = []

            for (var property in pedidos) {

                //######## SETA A LISTA DE TRANSPORTADORAS PARA O FILTRO ########
                if (transportadoras.indexOf(pedidos[property].Transportadora) === -1){

                    transportadoras.push(
                        pedidos[property].Transportadora
                    )
                    indexTR = indexTR + 1
                }
                //console.log(indexTR)

                listTR = transportadoras.map( item => {
                    return (
                        // <option key={item.key} value={indexTR}>{item}</option>
                        <option key={item.key} value={indexTR}>{item}</option>
                    )
                }
                );

                

                //######## SETA A LISTA DE LOJAS PARA O FILTRO ########
                if (lojas.indexOf(pedidos[property].Loja) === -1){

                    lojas.push(
                        pedidos[property].Loja
                    )
                    indexLJ ++
                }

                listLJ = lojas.map( item => {
                    return (
                        <option key={item.key} value={indexLJ}>{item}</option>
                    )
                }
                );

            }

            setFilterTransportadora(listLJ)
            setFilterLoja(listTR)
   
            // console.log(pedidos.length)

            // for (var property in pedidos) {
            for (var property = pedidos.length -1; property >= 0; property --) {

                // pedidos[property]

                // console.log(property)

                var data = pedidos[property].Data

                data = data.split("T")[0].split("-")

                data = `${data[2]}-${data[1]}-${data[0]}`

                let Pesquisa = currentFilterSearch.toLowerCase()
                let Cliente = pedidos[property].Nome_do_contato.toLowerCase()
                let Situacao = filterSituacao()

                
                // console.log(pedidos[property])

                if (Cliente.includes(Pesquisa) || currentFilterSearch === ""){
                    if((Situacao === pedidos[property].Situacao || Situacao === "Escolha")){
                        if(filterLoj() === pedidos[property].Loja || filterLoj() === "Escolha"){
                            if (filterTransp() === pedidos[property].Transportadora || filterTransp() === "Escolha"){

                                // console.log(Situacao)

                                list.push(
                                    
                                        <tr>
                                            <td><input type="checkbox" id={`order_ ${pedidos[property].id}`}/></td>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].id}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].ID_pedido}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{data}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].Nome_do_contato}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].Transportadora}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].Loja}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].Situacao}</td></Link>
                                            <Link href={`pedidos/${pedidos[property].id}/`} passHref ><td>{pedidos[property].Origem}</td></Link>
                                        </tr>

                                )
                            }
                        }
                    }
                }

                var listItems = list.map((item) =>
                {
                    return(
                        <>{item}</>
                    )

                }
                );

                setList(listItems)
                
            }
            
        });
        
    }

    function page(){

        return (
            <>
     
            <div style={{
                display: "flex",
                fontSize: "11px"
            
            }}> {'> '}Pedidos</div>

            <div className={styles.search}>
                <input onKeyPress={e => {
                    setCurrentFilterSearch(e.target.value)
                    if (e.charCode === 13) {
                        // e.target.value = ""
                        setOrderList();
                    }

                }} type="text" placeholder="Pesquise por nome/pedido" id="search"/>
                <button onClick={setOrderList}>Go</button>
            </div>
            
            <div className={styles.filters}>

                <div>
                    <label  htmlFor="filter-situacao">Situações:</label>
                    <select name="filter-situacao" id="filter-situacao" onChange={e => {setCurrentFilterSituacao(e.target)}}>
                        <option value="0">Escolha</option>
                        <option value="1">Pendente</option>
                        <option value="2">Em separação</option>
                        <option value="3">Atendido</option>
                        <option value="4">Em falta</option>
                        <option value="5">Aguardando NF</option>
                       

                    </select>
                </div>

                <div>
                    <label  htmlFor="filter-loja">Transportadora:</label>
                    <select name="filter-loja" id="filter-loja" onChange={e => {setCurrentFilterTransportadora(e.target)}}>
                        <option value="0">Escolha</option>
                        {filterLoja}

                    </select>
                </div>

                <div>
                    <label  htmlFor="filter-transportadora">Loja:</label>
                    <select name="filter-transportadora" id="filter-transportadora" onChange={e => {setCurrentFilterLoja(e.target)}}>
                        <option value="0">Escolha</option>
                        {filterTransportadora}

                    </select>
                </div>
                
                

            </div>


            <div className={styles.orders}>
            <table>

                <thead>
                    <tr>
                        <th><input type="checkbox" id="select1" /></th>

                        <th>Pedido</th>

                        <th>Pedido - Origem</th>

                        <th>Data</th>

                        <th>Cliente</th>

                        <th>Transportadora</th>

                        <th>Loja</th>

                        <th>Situação</th>

                        <th>Origem</th>
                    </tr>
                </thead>   

                <tbody>
                {list}
                </tbody>

            </table>

            </div>

            </>


        )

        

    }

    function filterTransp(){

        let currentIndex = ''

        if(currentFilterTransportadora.options != undefined){
            currentIndex = currentFilterTransportadora.options.selectedIndex

            return currentFilterTransportadora.options[currentIndex].label
        }
        else{

            return "Escolha"
        }
    }
    function filterLoj(){

        let currentIndex = ''

        if(currentFilterLoja.options != undefined){
            currentIndex = currentFilterLoja.options.selectedIndex

            return currentFilterLoja.options[currentIndex].label
        }
        else{

            return "Escolha"
        }
    }
    function filterSituacao(){

        let currentIndex = ''

        if(currentFilterSituacao.options != undefined){
            currentIndex = currentFilterSituacao.options.selectedIndex

            return currentFilterSituacao.options[currentIndex].label
        }
        else{

            return "Pendente"
        }
    }

    
    useEffect( () => {

        setOrderList()

    }, []
    )


    
    return (
        <>{page()}</>
    )
}