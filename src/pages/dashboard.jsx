import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../styles/DashboardExpedicao.module.css"

/* PEDIDOS COM ATRASO - 1 DIA ECOMMERCE - E COM ATRASO - 1 DIA INTERNO */

export default function CheckoutView() {

    var [time, setTime] = useState(`00:00:00`)
    var [data, setData] = useState(
        {bling:
            {
                "qntd_pedidos_pendentes.length": 0,
                "qntd_pedidos_situacoes_aguardando_nf.length": 0,
                "qntd_pedidos_situacoes_atendidos.length": 0,
                "qntd_pedidos_situacoes_faltando.length": 0,
                "qntd_pedidos_situacoes_separando.length": 0,
                "qntd_romaneios.length": 0,
                "qtnd_transportadoras": []
            },
        supra: {
            "qntd_romaneios.length": 0,
            "qntd_pedidos_situacoes_atendidos.length": 0,
            "qntd_pedidos_situacoes_separando.length": 0,
            "qntd_pedidos_situacoes_aguardando_nf.length": 0,
            "qntd_pedidos_situacoes_faltando.length": 0,
            "qntd_pedidos_pendentes.length": 0,
            "qtnd_transportadoras": {}
        }
        }
    )


    const _ICON_CHART = (
        <svg width="61" height="56" viewBox="0 0 61 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30.3429" cy="28.3889" rx="30.2165" ry="27.5432" fill="#333333"/>
        <path d="M46.6018 27.842H29.1581V11.9416C29.1581 11.7461 28.9827 11.5863 28.7683 11.5863H27.5015C24.9419 11.5824 22.4068 12.04 20.042 12.9326C17.6772 13.8251 15.5293 15.1351 13.7219 16.7872C11.942 18.4046 10.5238 20.3218 9.54617 22.4323C8.52881 24.6212 8.00676 26.9748 8.01132 29.3521C8.00713 31.6852 8.50908 33.996 9.48829 36.1516C10.4675 38.3072 11.9047 40.2651 13.7171 41.9125C15.5053 43.5425 17.5907 44.8261 19.9101 45.7188C22.3114 46.6462 24.8935 47.122 27.5015 47.1179C30.061 47.1217 32.5961 46.6642 34.961 45.7716C37.3258 44.879 39.4737 43.569 41.281 41.9169C43.0692 40.2869 44.4774 38.386 45.4568 36.2719C46.4741 34.0829 46.9962 31.7293 46.9916 29.3521V28.1973C46.9916 28.0019 46.8162 27.842 46.6018 27.842ZM38.8886 39.825C37.3798 41.1896 35.5905 42.2694 33.6231 43.0026C31.6557 43.7358 29.5489 44.1079 27.4235 44.0977C23.1308 44.0799 19.0963 42.5476 16.0608 39.7806C13.0057 36.9958 11.3246 33.2916 11.3246 29.3521C11.3246 25.4125 13.0057 21.7083 16.0608 18.9235C18.7212 16.4985 22.1466 15.0195 25.8448 14.6819V30.8622H43.5955C43.2203 34.251 41.5831 37.3911 38.8886 39.825ZM50.8897 25.3725L50.763 24.12C50.3488 20.0295 48.3559 16.1698 45.1498 13.2562C41.9415 10.3373 37.7159 8.53082 33.2023 8.14857L31.8234 8.03309C31.5944 8.01532 31.3995 8.17521 31.3995 8.38396V25.4436C31.3995 25.639 31.5749 25.7989 31.7893 25.7989L50.4999 25.7545C50.7289 25.7545 50.9091 25.5768 50.8897 25.3725ZM34.7031 22.7876V11.3908C37.7725 11.9764 40.5892 13.362 42.811 15.3793C45.0377 17.4046 46.5628 19.9806 47.1963 22.7565L34.7031 22.7876Z" fill="#00A137"/>
        </svg>
    )

    const _ICON_CLOCK = (
        <svg width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30.9631" cy="27.8451" rx="30.2926" ry="27.5432" fill="#333333"/>
        <g clipPath="url(#clip0_4_133)">
        <path d="M30.7634 6.47643C17.8953 6.47643 7.46143 15.9633 7.46143 27.6635C7.46143 39.3636 17.8953 48.8505 30.7634 48.8505C43.6315 48.8505 54.0654 39.3636 54.0654 27.6635C54.0654 15.9633 43.6315 6.47643 30.7634 6.47643ZM30.7634 45.2563C20.0799 45.2563 11.4144 37.3774 11.4144 27.6635C11.4144 17.9496 20.0799 10.0707 30.7634 10.0707C41.4469 10.0707 50.1123 17.9496 50.1123 27.6635C50.1123 37.3774 41.4469 45.2563 30.7634 45.2563Z" fill="#A17400"/>
        <path d="M39.8501 33.6507L32.433 28.7749V17.07C32.433 16.8619 32.2458 16.6916 32.0169 16.6916H29.5151C29.2862 16.6916 29.099 16.8619 29.099 17.07V30.0943C29.099 30.2173 29.1614 30.3308 29.2706 30.4017L37.8736 36.1052C38.0609 36.2282 38.3209 36.1903 38.4562 36.0248L39.9437 34.1804C40.079 34.0054 40.0374 33.7689 39.8501 33.6507Z" fill="#A17400"/>
        </g>
        <defs>
        <clipPath id="clip0_4_133">
        <rect width="55.3921" height="50.3647" fill="white" transform="translate(4.13257 3.44971)"/>
        </clipPath>
        </defs>
        </svg>
    )

    const _ICON_BOX = (
        <svg width="62" height="57" viewBox="0 0 62 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30.9" cy="28.5389" rx="30.2926" ry="27.5432" fill="#333333"/>
        <path d="M28.8691 12.1219C29.4904 11.8081 30.1894 11.6435 30.9 11.6435C31.6107 11.6435 32.3097 11.8081 32.931 12.1219L48.6496 20.0599C48.9755 20.2247 49.247 20.4657 49.436 20.7579C49.6251 21.0502 49.7247 21.3831 49.7247 21.7221V37.3833C49.7245 38.0616 49.5249 38.7275 49.1465 39.312C48.768 39.8965 48.2246 40.3784 47.5724 40.7077L32.931 48.1056C32.3097 48.4194 31.6107 48.584 30.9 48.584C30.1894 48.584 29.4904 48.4194 28.8691 48.1056L14.2277 40.7077C13.5758 40.3785 13.0326 39.897 12.6542 39.3128C12.2758 38.7287 12.0759 38.0632 12.0754 37.3852V21.7221C12.0754 21.3831 12.175 21.0502 12.3641 20.7579C12.5531 20.4657 12.8246 20.2247 13.1505 20.0599L28.8712 12.1219H28.8691Z" stroke="#0086E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30.9 30.1128V48.1798M12.0754 20.6038L30.9 30.1128L12.0754 20.6038ZM30.9 30.1128L49.7247 20.6038L30.9 30.1128Z" stroke="#0086E7" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M18.3503 30.7366L24.6252 33.9164M21.4877 25.3583L40.3124 15.8494L21.4877 25.3583Z" stroke="#0086E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const _ICON_DOLLAR = (
        <svg width="61" height="57" viewBox="0 0 61 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30.4019" cy="28.5389" rx="30.2926" ry="27.5432" fill="#333333"/>
        <g clipPath="url(#clip0_14_332)">
        <path d="M29.0875 6.32291C16.0566 6.32291 5.49077 16.4632 5.49077 28.9691C5.49077 41.4751 16.0566 51.6154 29.0875 51.6154C42.1184 51.6154 52.6842 41.4751 52.6842 28.9691C52.6842 16.4632 42.1184 6.32291 29.0875 6.32291ZM29.0875 47.7736C18.2688 47.7736 9.49378 39.352 9.49378 28.9691C9.49378 18.5862 18.2688 10.1647 29.0875 10.1647C39.9062 10.1647 48.6812 18.5862 48.6812 28.9691C48.6812 39.352 39.9062 47.7736 29.0875 47.7736ZM31.5999 27.7964L30.2621 27.4981V20.7093C32.2636 20.9722 33.5013 22.1753 33.712 23.6513C33.7384 23.8535 33.9174 24.0001 34.1281 24.0001H36.4931C36.7406 24.0001 36.9355 23.7929 36.9144 23.5553C36.5931 20.406 33.8911 18.384 30.2831 18.0353V16.3823C30.2831 16.1599 30.0935 15.9779 29.8618 15.9779H28.3817C28.1499 15.9779 27.9603 16.1599 27.9603 16.3823V18.0504C24.2312 18.3992 21.3132 20.3757 21.3132 24.0658C21.3132 27.483 23.9362 29.1309 26.6909 29.7628L27.9919 30.0812V37.2947C25.6639 36.9964 24.3576 35.8034 24.089 34.196C24.0574 34.0039 23.8783 33.8623 23.6729 33.8623H21.2395C20.9919 33.8623 20.797 34.0645 20.8181 34.3021C21.0551 37.0823 23.2515 39.6402 27.9393 39.9687V41.556C27.9393 41.7784 28.1289 41.9604 28.3606 41.9604H29.8565C30.0882 41.9604 30.2779 41.7784 30.2779 41.5509L30.2673 39.9485C34.3915 39.5997 37.3411 37.4817 37.3411 33.6804C37.3358 30.1722 35.013 28.6052 31.5999 27.7964ZM27.9867 26.9775C27.6917 26.8966 27.4441 26.8208 27.1966 26.7247C25.4163 26.108 24.5894 25.1122 24.5894 23.8282C24.5894 21.9933 26.0378 20.9469 27.9867 20.7093V26.9775ZM30.2621 37.3098V30.5513C30.4253 30.5968 30.5728 30.6322 30.7256 30.6625C33.2169 31.3905 34.0544 32.4014 34.0544 33.9533C34.0544 35.9298 32.5059 37.1177 30.2621 37.3098Z" fill="#1AF1D7"/>
        </g>
        <defs>
        <clipPath id="clip0_14_332">
        <rect width="51.6351" height="47.1421" fill="white" transform="translate(4.02289 6.57483)"/>
        </clipPath>
        </defs>
        </svg>
    )

    const _ICON_BOX_ERROR = (
        <svg width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30.9602" cy="28.008" rx="30.2926" ry="27.5432" fill="#333333"/>
        <g clipPath="url(#clip0_4_145)">
        <path d="M34.2231 10.8462C32.1285 10.0843 29.7919 10.0843 27.6973 10.8462L13.2474 16.1065C12.5494 16.3604 11.951 16.7984 11.5292 17.3641C11.1073 17.9299 10.8814 18.5975 10.8806 19.281V36.7303C10.8804 37.4146 11.1059 38.0833 11.5278 38.6499C11.9497 39.2166 12.5487 39.6553 13.2474 39.9094L27.6973 45.1652C28.7938 45.5644 29.9676 45.7584 31.1484 45.7357C30.5385 44.9854 30.0224 44.1755 29.6098 43.3212C29.2759 43.2542 28.9485 43.1626 28.631 43.0473L14.1786 37.7915C13.9456 37.7066 13.7459 37.5601 13.6054 37.3709C13.4649 37.1817 13.3901 36.9586 13.3905 36.7303V19.4225L29.7052 25.3561V33.0401C30.3343 31.7976 31.1821 30.6568 32.2152 29.6625V25.3561L48.5299 19.4225V27.0951C49.4284 27.5127 50.2693 28.0171 51.0398 28.5945V19.2833C51.04 18.599 50.8145 17.9304 50.3926 17.3637C49.9707 16.7971 49.3717 16.3584 48.673 16.1043L34.2231 10.8462ZM28.631 12.9686C30.127 12.4245 31.7959 12.4245 33.2919 12.9686L46.4065 17.7383L40.6863 19.815L25.24 14.201L28.6284 12.9686H28.631ZM21.8616 15.4265L37.3079 21.0428L30.9602 23.3547L15.5139 17.736L21.8616 15.4288V15.4265ZM53.5498 38.2776C53.5498 41.0013 52.3598 43.6134 50.2416 45.5394C48.1234 47.4653 45.2506 48.5473 42.255 48.5473C39.2594 48.5473 36.3866 47.4653 34.2684 45.5394C32.1502 43.6134 30.9602 41.0013 30.9602 38.2776C30.9602 35.5539 32.1502 32.9418 34.2684 31.0159C36.3866 29.0899 39.2594 28.008 42.255 28.008C45.2506 28.008 48.1234 29.0899 50.2416 31.0159C52.3598 32.9418 53.5498 35.5539 53.5498 38.2776ZM46.9085 35.6623C47.1441 35.448 47.2765 35.1574 47.2765 34.8544C47.2765 34.5514 47.1441 34.2608 46.9085 34.0465C46.6728 33.8323 46.3532 33.7119 46.0199 33.7119C45.6867 33.7119 45.3671 33.8323 45.1314 34.0465L42.255 36.6642L39.3786 34.0465C39.1429 33.8323 38.8233 33.7119 38.4901 33.7119C38.1568 33.7119 37.8372 33.8323 37.6015 34.0465C37.3659 34.2608 37.2335 34.5514 37.2335 34.8544C37.2335 35.1574 37.3659 35.448 37.6015 35.6623L40.4805 38.2776L37.6015 40.893C37.4849 40.9991 37.3923 41.125 37.3292 41.2636C37.266 41.4022 37.2335 41.5508 37.2335 41.7009C37.2335 41.8509 37.266 41.9995 37.3292 42.1381C37.3923 42.2767 37.4849 42.4026 37.6015 42.5087C37.7182 42.6148 37.8567 42.699 38.0092 42.7564C38.1616 42.8138 38.3251 42.8434 38.4901 42.8434C38.6551 42.8434 38.8185 42.8138 38.9709 42.7564C39.1234 42.699 39.2619 42.6148 39.3786 42.5087L42.255 39.8911L45.1314 42.5087C45.2481 42.6148 45.3866 42.699 45.5391 42.7564C45.6915 42.8138 45.8549 42.8434 46.0199 42.8434C46.1849 42.8434 46.3483 42.8138 46.5008 42.7564C46.6532 42.699 46.7918 42.6148 46.9085 42.5087C47.0251 42.4026 47.1177 42.2767 47.1808 42.1381C47.244 41.9995 47.2765 41.8509 47.2765 41.7009C47.2765 41.5508 47.244 41.4022 47.1808 41.2636C47.1177 41.125 47.0251 40.9991 46.9085 40.893L44.0295 38.2776L46.9085 35.6623Z" fill="#A11300"/>
        </g>
        <defs>
        <clipPath id="clip0_4_145">
        <rect width="45.0061" height="40.9213" fill="white" transform="translate(9.32269 8.33426)"/>
        </clipPath>
        </defs>
        </svg>
    )


    function group(info){

        // title: "Total de Envios",
        // icon: "shopping-cart",
        // qntd: "50",
        //
        
        // console.log(info)

        return(
            <div className={styles.ecommerce_group}>
                    
                
                    <div className={styles.ecommerce_dado_title}>
                        {info.title}
                    </div>
                
                    <div style={{display: "flex"}}>
                        <div className={styles.ecommerce_icon}>
                            {info.icon}
                        </div>


                        <div className={styles.ecommerce_dado_text}>
                            {info.qntd}
                        </div>

                        {/* <div className={styles.ecommerce_dado_porcentagem}>

                            <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.39377 7.12853L7.58447 0.832947L13.4804 7.12853H1.39377Z" fill="#00DE4C" stroke="#00A137"/>
                            </svg>
                            <div>{info.comp}</div>
                        </div>  */}
                   
                    </div>

                </div>
        )
    }

    function view(){
        return(
            <div className={styles.ecommerce}>
            <div className={styles.ecommerce_title}>
                E-Commerce
            </div>
            
            <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
            }}>
                {group({
                title: "Total de Envios",
                icon: _ICON_CHART,
                qntd: data.bling["qntd_pedidos_situacoes_atendidos.length"],
               
                })}
                {group({
                title: "Envios Pendentes",
                icon: _ICON_CLOCK,
                qntd: data.bling["qntd_pedidos_pendentes.length"],
               
                })}
                {group({
                title: "Em Separação",
                icon: _ICON_BOX
                ,
                qntd: data.bling["qntd_pedidos_situacoes_separando.length"],
               
                })}
                {group({
                title: "Aguardando Nota Fiscal",
                icon: _ICON_DOLLAR                   
                ,
                qntd: data.bling["qntd_pedidos_situacoes_aguardando_nf.length"],
               
                })}

                {group({
                title: "Pedidos com Falta",
                icon: _ICON_BOX_ERROR         
                ,
                qntd: data.bling["qntd_pedidos_situacoes_faltando.length"],
               
                })}
                    
      
            </div>
                
        </div>
        )
    }

    function view2(){
        return(
            <div className={styles.ecommerce}>
            <div className={styles.ecommerce_title}>
                Interno
            </div>
            
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                flexWrap: "wrap",
            }}>
                {group({
                title: "Total de Envios",
                icon: _ICON_CHART,
                qntd: data.supra["qntd_pedidos_situacoes_atendidos.length"],
               
                })}
                {group({
                title: "Envios Pendentes",
                icon: _ICON_CLOCK,
                qntd: data.supra["qntd_pedidos_pendentes.length"],
               
                })}
                {group({
                title: "Em Separação",
                icon: _ICON_BOX
                ,
                qntd: data.supra["qntd_pedidos_situacoes_separando.length"],
               
                })}
                {group({
                title: "Aguardando Nota Fiscal",
                icon: _ICON_DOLLAR                   
                ,
                qntd: data.supra["qntd_pedidos_situacoes_aguardando_nf.length"],
               
                })}

                {group({
                title: "Pedidos com Falta",
                icon: _ICON_BOX_ERROR         
                ,
                qntd: data.supra["qntd_pedidos_situacoes_faltando.length"],
               
                })}
                    
      
            </div>
                
        </div>
        )
    }

    function horariosCorte(){

        var transpList = []

        var qtnd_transportadoras_ecommerce = data.bling.qtnd_transportadoras
        var qtnd_transportadoras_interno = data.supra.qtnd_transportadoras

        for(let i in qtnd_transportadoras_ecommerce){
            transpList.push(
                <tr key={`ecommerce${i}`}>
                    <td>14:00</td>
                    <td>{i}</td>
                    <td>{qtnd_transportadoras_ecommerce[i]}</td>
                </tr>
            )
        }


        for(let i in qtnd_transportadoras_interno){
            
            transpList.push(
                <tr key={`interno${i}`}>
                    <td>14:00</td>
                    <td>{i}</td>
                    <td>{qtnd_transportadoras_interno[i]}</td>
                </tr>
            )
        }

        return (
        <div className={styles.horarios_corte}>
            <div className={styles.horarios_corte_titulo}><span>Horários de Corte</span></div>
            <div>
                <table className={styles.tabela_horarios_corte}>
                    <thead>
                        <tr>
                            <th>Horário</th>
                            <th>Transportadora</th>
                            <th>Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transpList}
                    </tbody>
                </table>
            </div>
            
        </div>
        )


    }

    async function stream() {

        var config = {
            method: 'get',
            url: '/api/stream_dados',
            headers: { }
            };
    
            axios(config)
            .then(function (response) {
                setData(response.data)
        })

        setTimeout(async function() {

            var config = {
            method: 'get',
            url: '/api/stream_dados',
            headers: { }
            };

            var response = await axios(config)

            // console.log(response.data)

            setData(response.data)
            

            await stream();

        }, 10000);
        
    }
    async function startTime() {
        const today = new Date()
        let h = today.getHours()
        let m = today.getMinutes()
        let s = today.getSeconds()
        m = `${m}`.padStart(2, '0')
        s = `${s}`.padStart(2, '0')

        setTime(`${h}:${m}:${s}`)

        setTimeout(async function() {
            
            await startTime();

        }, 1000);
        
    }


    useEffect( () => {
        stream()
    }, [1])

    useEffect( () => {
        startTime()
    }, [1])

    return (

        <main className={styles.main}>
            <title>Dashboard</title>

            <div className={styles.container}>
            <div className={styles.title}> 
                <div><span>Dashboard</span></div>
                <div>{time}</div>
            </div>

            <div style={{display: "flex"}}>
                <div className={styles.bling}>{view()}</div>
                <div className={styles.interno}>{view2()}</div>
            </div>

            {horariosCorte()}

            </div>
        </main>
    )

}
