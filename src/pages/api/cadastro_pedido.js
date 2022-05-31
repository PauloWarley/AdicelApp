const jwt = require("jsonwebtoken")


const SECRET = process.env.SECRET
// const SECRET = "shhhhh"
var host = process.env.HOST
// host="http://localhost:3000"

export default async function cadastroPedido(req, res) { 

    // console.log("KEYS: ", pedido)

    if (req.method === "POST"){

        var pedido = req.body.pedido

        // console.log("KEYS: ", pedido)
        
        // ### GRAVA  automate.pedidos_produtos COM OS PRODUTOS/ PEDIDO


        
        for (let i = 0; i < pedido.items.length; i++){

            var query = ` 
                
                INSERT INTO pedidos_produtos (
                    ID_pedido, 
                    DATA, 
                    ID_produto, 
                    Descricao,
                    Quantidade,
                    unidade,
                    GTIN, 
                    Valor_unitario,
                    created_date,
                    modified_date,
                    changed_by
                )
                SELECT * FROM
                (
                    SELECT 
                        "${pedido.ID_pedido}" AS ID_pedido, 
                        "${pedido.Data}" AS DATA,  
                        "${pedido.items[i].ID_produto}" AS ID_produto, 
                        "${pedido.items[i].Descricao}" AS Descricao, 
                        "${pedido.items[i].Quantidade}" AS Quantidade, 
                        "${pedido.items[i].unidade}" AS unidade, 
                        "${pedido.items[i].GTIN}" AS GTIN, 
                        "${pedido.items[i].Valor_unitario}" AS Valor_unitario,
                        now() AS created_date,
                        now() AS modified_date,
                        "0" AS changed_by
                ) AS tmp
                WHERE NOT EXISTS
                (
                    SELECT ID_pedido, ID_produto FROM pedidos_produtos WHERE ID_pedido = "${pedido.ID_pedido}" AND ID_produto = "${pedido.items[i].ID_produto}"    
                ) LIMIT 1;`


            let data={query : query}

            new Promise((resolve, reject) => {
                fetch(`${host}/api/database`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)

                    })
                    .then( (response) => 
                    response.json()
                    .then( resp => {
                        
                        if (response.status == 200)
                        {

                            resolve()

                        }
                        
                    } 
                            
                    )
                )
            })
        }

        var pedido = req.body.pedido

        // console.log("KEYS: ", req.body.pedido)

        // ### GRAVA  automate.pedidos COM OS PRODUTOS/ CLIENTE

        var transportadora = pedido.Transportadora 

        if ( pedido.Transportadora === undefined){

            transportadora = "Sem Transporte"

        }
        else if ( pedido.Loja === undefined){

            pedido.Loja = ""

        }
        
        var query =   `
            INSERT INTO pedidos 
            (
                ID_pedido, 
                Data, 
                Nome_do_contato, 
                Transportadora, 
                Loja, 
                Situacao, 
                Origem, 
                Endereco, 
                Endereco_Numero, 
                Bairro, 
                Cidade, 
                UF, 
                Email, 
                Telefone, 
                Celular, 
                N_NFe,
                created_date,
                modified_date,
                changed_by
            
            )
            
            SELECT * FROM 
            (
                SELECT 
            
                "${pedido.ID_pedido}" AS ID_pedido,
                "${pedido.Data}" AS Data ,
                "${pedido.Nome_do_contato}" AS Nome_do_contato ,
                "${transportadora}" AS Transportadora ,
                "${pedido.Loja}" AS Loja ,
                "${pedido.Situacao}" AS Situacao ,
                "${pedido.Origem}" AS Origem ,
                "${pedido.Endereco}" AS Endereco ,
                    "${pedido.Endereco_Numero}" AS Endereco_Numero ,
                    "${pedido.Bairro}" AS Bairro ,
                    "${pedido.Cidade}" AS Cidade ,
                    "${pedido.UF}" AS UF ,
                    "${pedido.Email}" AS Email ,
                    "${pedido.Telefone}" AS Telefone ,
                    "${pedido.Celular}" AS Celular ,
                    "${pedido.N_NFe}" AS N_NFe,
                    now() AS created_date,
                    now() AS modified_date,
                    "0" AS changed_by
            
            ) AS tmp 
            
            WHERE NOT EXISTS 
            (
                SELECT ID_pedido FROM pedidos WHERE ID_pedido = '${pedido.ID_pedido}'
            ) LIMIT 1;
            ` 
            
            

        let data={query : query}

        // console.log("INFO: ", query)

        return new Promise((resolve, reject) => {
            fetch(`${host}/api/database`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)

                })
                .then( (response) => 
                response.json()
                .then( resp => {

                    if (response.status == 200)
                    {
                        // console.log(query)
                        res.status(200).json(resp)
                        resolve()
                    }
                    
                } 
                        
                )
            )
        })


    }
  }

     