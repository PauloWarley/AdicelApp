import ReactDOMServer from 'react-dom/server'

export default function NFTag(){

    function genTags(){    
        
        var notaFiscal, volumeMax

        if (document.getElementById("volumeMax") != null){
            volumeMax = document.getElementById("volumeMax").value
        }

        if (document.getElementById("notaFiscal") != null){
            notaFiscal = document.getElementById("notaFiscal").value
        }

        var pedido = [1, volumeMax]

        var etiquetaLista = ""
        
        for (var i = 1; i <= pedido[1]; i++) {
            etiquetaLista += (ReactDOMServer.renderToString(
                <svg 
                    id={i}
                    width="95mm"
                    height={"20mm"}
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
                        x={"0mm"}
                        y={"9mm"}
                        fontFamily="Times New Roman"
                        fontSize={40}
                        fontWeight={400}
                        fill="#000"
                    >
                        NF:
                    </text>

                    <text
                        stroke="none"
                        xmlSpace="preserve"
                        x={"0mm"}
                        y={"20mm"}
                        fontFamily="Times New Roman"
                        fontSize={35}
                        fontWeight={400}
                        fill="#000"
                    >
                        {`${pedido[0] ++}/${pedido[1]}`}
                    </text>

                    <text
                        stroke="none"
                        xmlSpace="preserve"
                        x={"15mm"}
                        y={"20mm"}
                        fontFamily="Times New Roman"
                        fontSize={105}
                        fontWeight={400}
                        fill="#000"
                    >
                        {notaFiscal}
                    </text>

                    
                    </g>
                </svg>

                // )

            ))
        }

        // console.log(etiquetaLista)

        GenTags(etiquetaLista)


    }

    async function GenTags(etiqueta) {

        //############# DEFINE OS IFRAME QUE RECEBERÁ O CONTEUDO DE IMPRESSÃO #############
        var pri = document.getElementById("ifmcontentstoprinttag").contentWindow;
        pri.document.open();

        //############# FAZ A PAGINA QUEBRAR NO MOMENTO DA IMPRESSÃO #############
        // pri.document.write(`
        // <head>
        //     <style>
        //         body {
        //             page-break-before: always;
        //         }
        //     </style>
        // </head>`
        // )

        pri.document.write(etiqueta)

        pri.document.close()

        // console.log(document.getElementById("ifmcontentstoprinttag"))

        pri.focus();

        pri.print()

    }

    return (
        <main >
            <div>
                <span>Nota Fiscal</span>
                <span> </span>
                <input id='notaFiscal' type="text" />
            </div>
            <div>
                <span>Volume</span>
                <span> </span>
                <input id='volumeMax' type="text" />
            </div>
            <div>
                <button onClick={() => genTags()}>Gerar</button>
            </div>
            
            <iframe style={{display: "none"}} id="ifmcontentstoprinttag"></iframe>
            
        </main>
    )

}


