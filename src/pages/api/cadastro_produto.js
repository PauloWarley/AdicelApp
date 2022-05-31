import { resolveHref } from "next/dist/shared/lib/router/router"

const jwt = require("jsonwebtoken")


const SECRET = process.env.SECRET

var host = process.env.HOST
// host="http://localhost:3000"

export default async function cadastroPedido(req, res) { 

      

    if (req.method === "POST"){

        var produto = req.body.produto

        console.log("KEYS: ", req.body.produto)

        // ### GRAVA  automate.produtos COM OS PRODUTOS
        
        var query =   `
        INSERT INTO automate.produtos 
        (
        
            Codigo, 
            Descricao, 
            unidade, 
            Vlr_Venda, 
            Vlr_Custo, 
            ID_Categoria, 
            Est_Maximo, 
            Fornecedor, 
            Localizacao, 
            Est_Minimo, 
            Peso_Liquido, 
            Peso_Bruto, 
            Cod_Barra, 
            Situacao, 
            Estoque, 
            ID_Fornecedor, 
            Imagem, 
            Largura, 
            Altura, 
            Profundidade,
            created_date,
            modified_date, 
            changed_by
        
        ) 
        
        SELECT * FROM 
        (
            SELECT
                '${produto.Codigo}' AS Codigo, 
                '${produto.Descricao}' AS Descricao, 
                '${produto.unidade}' AS unidade, 
                '${produto.Vlr_Venda}' AS Vlr_Venda, 
                '${produto.Vlr_Custo}' AS Vlr_Custo, 
                '${"0"}' AS ID_Categoria, 
                '${produto.Est_Maximo}' AS Est_Maximo, 
                '${"0"}' AS Fornecedor, 
                '${produto.Localizacao}' AS Localizacao, 
                '${produto.Est_Minimo}' AS Est_Minimo, 
                '${produto.Peso_Liquido}' AS Peso_Liquido, 
                '${produto.Peso_Bruto}' AS Peso_Bruto, 
                '${produto.Cod_Barra}' AS Cod_Barra, 
                '${produto.Situacao}' AS Situacao, 
                '${produto.Estoque}' AS Estoque, 
                '${"0"}' AS ID_Fornecedor, 
                '${"0"}' AS Imagem, 
                '${produto.Largura}' AS Largura, 
                '${produto.Altura}' AS Altura, 
                '${produto.Profundidade}' AS Profundidade, 
                now() AS created_date,
                now() AS modified_date,
                '0' AS changed_by
            
        ) AS tmp 
        
        WHERE NOT EXISTS 
        (
            SELECT Codigo FROM produtos WHERE Codigo = '${produto.Codigo}'
        ) LIMIT 1;
         
            `
            
            

        let data={query : query}

        console.log("INFO: ", query)


        await fetch(`${host}/api/database`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

            })
            .then( (response) => 
            response.json()
            .then( resp => {
                
                // console.log("response: ", resp, response.status )

                if (response.status == 200)
                {

                    res.status(200).json(resp)
                    response.ok

                }
                
            } 
                    
            )
        )


    }

    if (req.method === "PUT"){

        var produto = req.body.produto

        var query = `
            UPDATE produtos 
            SET
                Codigo = '${produto.Codigo}' , 
                Descricao = '${produto.Descricao}' , 
                unidade = '${produto.unidade}' , 
                Vlr_Venda = '${produto.Vlr_Venda}' , 
                Vlr_Custo = '${produto.Vlr_Custo}' , 
                ID_Categoria = '${"0"}' , 
                Est_Maximo = '${produto.Est_Maximo}' , 
                Fornecedor = '${"0"}' , 
                Localizacao = '${produto.Localizacao}' , 
                Est_Minimo = '${produto.Est_Minimo}' , 
                Peso_Liquido = '${produto.Peso_Liquido}' , 
                Peso_Bruto = '${produto.Peso_Bruto}' , 
                Cod_Barra = '${produto.Cod_Barra}' , 
                Situacao = '${produto.Situacao}' , 
                Estoque = '${produto.Estoque}' , 
                ID_Fornecedor = '${"0"}' , 
                Imagem = '${"0"}' , 
                Largura = = '${produto.Lagura}' , 
                Altura = = '${produto.Altura}' , 
                Profundidade = '${produto.Profundidade}'  
                modified_date = now(), 
                changed_by = "0"                  
            WHERE (Codigo = ${produto.Codigo});
        `




        // console.log("KEYS: ", req.body.produto)

        // ### GRAVA  automate.produtos COM OS PRODUTOS
        
        // var query =   `
        // INSERT INTO automate.produtos 
        // (
        
        //     Codigo, 
        //     Descricao, 
        //     unidade, 
        //     Vlr_Venda, 
        //     Vlr_Custo, 
        //     ID_Categoria, 
        //     Est_Maximo, 
        //     Fornecedor, 
        //     Localizacao, 
        //     Est_Minimo, 
        //     Peso_Liquido, 
        //     Peso_Bruto, 
        //     Cod_Barra, 
        //     Situacao, 
        //     Estoque, 
        //     ID_Fornecedor, 
        //     Imagem, 
        //     Largura, 
        //     Altura, 
        //     Profundidade,
        //     created_date,
        //     modified_date, 
        //     changed_by
        
        // ) 
        
        // SELECT * FROM 
        // (
        //     SELECT
        //         '${produto.Codigo}' AS Codigo, 
        //         '${produto.Descricao}' AS Descricao, 
        //         '${produto.unidade}' AS unidade, 
        //         '${produto.Vlr_Venda}' AS Vlr_Venda, 
        //         '${produto.Vlr_Custo}' AS Vlr_Custo, 
        //         '${"0"}' AS ID_Categoria, 
        //         '${produto.Est_Maximo}' AS Est_Maximo, 
        //         '${"0"}' AS Fornecedor, 
        //         '${produto.Localizacao}' AS Localizacao, 
        //         '${produto.Est_Minimo}' AS Est_Minimo, 
        //         '${produto.Peso_Liquido}' AS Peso_Liquido, 
        //         '${produto.Peso_Bruto}' AS Peso_Bruto, 
        //         '${produto.Cod_Barra}' AS Cod_Barra, 
        //         '${produto.Situacao}' AS Situacao, 
        //         '${produto.Estoque}' AS Estoque, 
        //         '${"0"}' AS ID_Fornecedor, 
        //         '${"0"}' AS Imagem, 
        //         '${produto.Lagura}' AS Largura, 
        //         '${produto.Altura}' AS Altura, 
        //         '${produto.Profundidade}' AS Profundidade, 
        //         now() AS created_date,
        //         now() AS modified_date,
        //         '0' AS changed_by
            
        // ) AS tmp 
        
        // WHERE NOT EXISTS 
        // (
        //     SELECT Codigo FROM produtos WHERE Codigo = '${produto.Codigo}'
        // ) LIMIT 1;
         
        //     `
            
            

        let data={query : "query"}

        // console.log("INFO: ", query)


        await fetch(`${host}api/database`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

            })
            .then( (response) => 
            response.json()
            .then( resp => {
                
                // console.log("response: ", resp, response.status )

                if (response.status == 200)
                {
                    res.status(200).json(resp)
                    response.ok
                }
                
            } 
                    
            )
        )


    }
  }

     