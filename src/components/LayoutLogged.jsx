import { useEffect, useState } from "react"
import styles from "../styles/LayoutLogged.module.css"
import NavegadorLeftSideBar from "./NavegadorLeftSideBar"


export default function Layout(props){

    var [page, setPage] =  useState({id: "btn_inicio"})
    var [mnLateral, setMenuLateral] = useState(<></>)
    var [mnLateralState, setMenuLateralState] = useState(true)
    var [mnLateralPadding, setMenuLateralPadding] = useState("30px")

    var activeModule = "btn_inicio";


    function pageView(src){
   
        return(
            <div id="content" style={{

                paddingLeft: mnLateralPadding,
                padding: "0px", 
                zIndex: "1",  /*Stay on top */
                height: "100vh"

            }}> 
                <object style={{
                    width:"100%",
                    height: "100%",
                    padding: "0px"
                    }} type="text/html" data={src}>
                </object>
            </div>
        )
    }

    function turnPage(){

        activeModule = page.id

        // console.log(activeModule)

        switch (activeModule){

            case("btn_inicio"):
                return pageView("/dashboard")
                break
            // case ("btn_clientes"):
            //     return pageView("app/clientes");
            //     break;
            case ("btn_config"):
                return pageView("app/config");
                break;
            case ("btn_engenharia"):
                return pageView("app/engenharia");
                break;

            // #############  ESTOQUE   #############
            case ("btn_estoque_gestao"):
                return pageView("app/estoque/gestao_produtos");
                break;
            case ("btn_estoque_config"):
                return pageView("app/estoque/configuracoes");
                break;
            case ("btn_estoque_inventario"):
                return pageView("app/estoque/inventario");
                break;

            // #############  EXPEDIÇÃO   #############

            case ("btn_expedicao"):
                return pageView("app/expedicao");
                break;
            case ("btn_expedicao_picking"):
                return pageView("app/expedicao/picking");
                break;    
            case ("btn_expedicao_checkout"):
                return pageView("app/expedicao/checkout");
                break;       
    
            case ("btn_expedicao_etiquetas"):
                return pageView("app/expedicao/etiquetas");
                break;

            case ("btn_expedicao_pedidos_liberacao"):
                return pageView("app/expedicao/pedidosemfalta");
                break;

            // #############  Bling   #############
            case ("btn_bling_pedidos"):
                return pageView("https://www.bling.com.br/vendas.php");
                break;

            // ############# PEDIDOS #############
            case ("btn_pedidos"):
                return pageView("app/pedidos");
                break;   
            case ("btn_pedido_ret"):
                return pageView("app/pedidoret");
                break;       
            case ("btn_usuarios_config"):
                return pageView("app/usuarios");
                break;
            case ("btn_integracoes_config"):
                return pageView("app/integracoes");
                break;      
            

                
        }

    }


    function menuLateral (){

        setMenuLateralState(!mnLateralState)
        console.log(mnLateralState)

        setMenuLateral(
            <div id="leftSideMenu" className={styles.leftSideMenu}>

                    <h1 id="app_name"> WMS </h1>


                    <input className={styles.input} type="text" placeholder="Acesso rápido"/>
                    
                    
                    
                    <div className={styles.max}> 
                    
                        <li id="btn_inicio" onClick={e => {setPage(e.target)}}> Início
                            
                        </li>
                        
                        {/* <li id="btn_novidades" onClick={e => {setPage(e.target)}}> Novidades
                            
                        </li> */}
                        <li id="btn_pedidos" className={styles.menu} onClick={e => {setPage(e.target)}}> Pedidos
                            {props.leftSideMenuPedidos}
                            <NavegadorLeftSideBar id="btn_pedido_ret" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Pedido Transferência</NavegadorLeftSideBar>
                        </li>
                        {/* <li id="btn_engenharia" className={styles.menu} onClick={e => {setPage(e.target)}}> Engenharia
                            {props.leftSideMenuEngenharia}
                        </li> */}
                        <li id="btn_expedicao" className={styles.menu} onClick={e => {setPage(e.target)}}> Expedição
                            <NavegadorLeftSideBar id="btn_expedicao_picking" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#picking">Picking</NavegadorLeftSideBar>
                            {/* <NavegadorLeftSideBar id="btn_expedicao_checkout" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Checkout</NavegadorLeftSideBar> */}
                            {/* <NavegadorLeftSideBar id="btn_expedicao_etiquetas" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Etiquetas</NavegadorLeftSideBar> */}
                            <NavegadorLeftSideBar id="btn_expedicao_pedidos_liberacao" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Pedidos Aguardando</NavegadorLeftSideBar>
                        </li>
                        {/* <li id="btn_bling" className={styles.menu} onClick={e => {setPage(e.target)}}> Bling
                            <NavegadorLeftSideBar id="btn_bling_pedidos" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Pedidos</NavegadorLeftSideBar>
      
                            
                        </li> */}
                        <li className={styles.menu}> Estoque
                            <NavegadorLeftSideBar id="btn_estoque_gestao" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Gestão de Produtos</NavegadorLeftSideBar>
                            <NavegadorLeftSideBar id="btn_estoque_inventario" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Inventário</NavegadorLeftSideBar>

                        </li>
                        {/* <li id="btn_clientes" className={styles.menu} onClick={e => {setPage(e.target)}}> Clientes
                            {props.leftSideMenuClientes}
                        </li> */}
                        <li id="btn_config" className={styles.menu} onClick={e => {setPage(e.target)}}> Configurações
                            {/* <NavegadorLeftSideBar id="btn_estoque_config" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Estoque</NavegadorLeftSideBar>
                            <NavegadorLeftSideBar id="btn_usuarios_config" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Usuários</NavegadorLeftSideBar> */}
                            <NavegadorLeftSideBar id="btn_integracoes_config" onClick={e => {setPage(e.target)}} color="white" backgroundColor="#111" href="#">Integrações</NavegadorLeftSideBar>
                            
                        </li>
        

                    </div>


                </div>
            )
        
        if (mnLateralState){
            
            for (var i = 0; i < 180; i++){
            
                setTimeout(() => {
                    setMenuLateralPadding(`${i}px`)
                    document.getElementById("leftSideMenu").style.width =`${i}px`
                }, i*1)
            }

        }
        else{
            setMenuLateral("")
            setMenuLateralPadding(`${0}px`)
        }

    }

    useEffect(() => {
        turnPage()
    }, [1])


    return (

 
        <main>
            <title>{props.title}</title>
            
            {mnLateral}    

            {/* <div>{props.server} {props.version}</div> */}

            <div className={styles.upSideMenu}>
                <div id="usuario_config" 

                    style={{
                        
                        paddingRight: "15px",
                        paddingTop: "5px",
                        textAlign: "center",
                        display:"flex",
                        justifyContent: "center"

                    }}  

                >{props.user}
                
                </div>

                <div id="organization_name" 

                style={{
                    
                    paddingLeft: "110px",
                    paddingTop: "5px",
                    textAlign: "center",
                    
                    justifyContent: "center"

                }}  

                >{props.organization}
                
                </div>
                <button style={{

                    color:"white",
                    backgroundColor: "#555",
                    borderColor: "#222"
                    
                }} 
                onClick={menuLateral}>Menu</button>

            </div>


            <div style={{paddingLeft:"0px"}} className={styles.content}>

                {props.children}
                
                {turnPage()}

            </div>

        </main>


    )

}