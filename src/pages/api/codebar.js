

export default async function CodeBar(req, res){

    var barcode = require('barcode');
    var code39 = barcode('code39', {
        data: "it works",
        width: 400,
        height: 100,
    });

    code39.getBase64(function (err, imgsrc) {
        if (err) throw err;
    
        // if we're using HTTP or another framework
        res.end('<img src="' + imgsrc + '">');
    });
    

    // res.status(200).send("ts")

    return

    <ReactJSBarcode value={pedido.id} options={{
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



    var pedidoFormatado = pedido.dataPedido.substring(0,10)

    pedidoFormatado = `${pedidoFormatado.substring(8,10)}-${pedidoFormatado.substring(5,7)}-${pedidoFormatado.substring(0,4)}`

    
    
    
        `<svg
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
                ${pedido.origem}
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
                ${pedidoFormatado}
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
                ${pedido.pedidoOrigem}
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
                NF:${pedido.nfOrigem ?? ""}
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
                Pedido WMS: ${pedido.id}
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
                Volume: ${pedido.volume}
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
                Embalagem: ${pedido.embalagem}
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
                ${ rotas[pedido.transportadora] || rotas[pedido.origem] || "Não identificado"}
            </text>
        
            </g>
        </svg>`

        

}