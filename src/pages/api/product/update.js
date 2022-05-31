import axios from "axios"

var HOST = process.env.HOST


export default async function cadastroPedido(req, res) { 

    if (req.method === "PUT"){

        var produto = req.body.produto

        console.log(produto.Codigo)

        // var query = `
        //     UPDATE produtos 
        //     SET
        //         Codigo = '${produto.Codigo}' , 
        //         Descricao = '${produto.Descricao}' , 
        //         unidade = '${produto.unidade}' , 
        //         Vlr_Venda = '${produto.Vlr_Venda}' , 
        //         Vlr_Custo = '${produto.Vlr_Custo}' , 
        //         ID_Categoria = '${"0"}' , 
        //         Est_Maximo = '${produto.Est_Maximo}' , 
        //         Fornecedor = '${"0"}' , 
        //         Localizacao = '${produto.Localizacao}' , 
        //         Est_Minimo = '${produto.Est_Minimo}' , 
        //         Peso_Liquido = '${produto.Peso_Liquido}' , 
        //         Peso_Bruto = '${produto.Peso_Bruto}' , 
        //         Cod_Barra = '${produto.Cod_Barra}' , 
        //         Situacao = '${produto.Situacao}' , 
        //         Estoque = '${produto.Estoque}' , 
        //         ID_Fornecedor = '${"0"}' , 
        //         Imagem = '${"0"}' , 
        //         Largura = = '${produto.Lagura}' , 
        //         Altura = = '${produto.Altura}' , 
        //         Profundidade = '${produto.Profundidade}'  
        //         modified_date = now(), 
        //         changed_by = "0"                  
        //     WHERE (Codigo = ${produto.Codigo});
        // `
        var query = `
            UPDATE produtos 
            SET
                Codigo = '${produto.Codigo}' , 
                Estoque = '${produto.Estoque}' , 
                modified_date = now(), 
                changed_by = "0"                  
            WHERE (Codigo = ${produto.Codigo});
        `

        let data={query : query}


        await axios.post(`${HOST}/api/database`, data)
        .then( (value) => {
            console.log(value)
            if (value.status == 200)
            {
                res.status(200).json(value.data)

            }

        })
        .catch(()=>{res.status(401)})  
        
    }
  }

     