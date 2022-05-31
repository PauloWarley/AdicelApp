import axios from "axios"

const _APIKEY = "2e9551b0e6982c3597e9b534ffa1af9ee43d243c0842eda76d370b2a1c37374c2d58bc0a"

export default async function UpdataProduct (req, res){

    function markets(){

        var _markets = {

            "amazon" : "203462997",
            "b2w" : "203478205",
            "carrefour" : "203756133",
            "facebook" : "203765529",
            "gpa" : "203764295",
            "magalu" : "203454961" ,
            "ifood" : "203881747", 
            "mercado livre" : "203366676",
            "shopee" : "203562850",
            "tray" : "203405503", 
            "via varejo" : "203460232"

        }

        return _markets
    }

    var marketList = markets()

    

    async function getProduct(id, market = "203462997"){

        var request = await axios.get(`https://bling.com.br/Api/v2/produto/${id}/json/?apikey=${_APIKEY}&loja=${market}`)

        return request.data["retorno"]["produtos"][0]
    }

    var id = "579"

    res.status(200).json( await getProduct(id) )


    return

    /*

    var preco = "25"
    var preco_promocional = "21"
    var id_loja_virtual = ""


    var id_produto = "1283"
    var id_fornecedor = "0"
    var id_marca = "0"
    var categoria_loja = "0"

    var id_loja = "203881747"

    //Verifica se o produto está cadastrado na loja


    for id_loja in lojas.values():

        if self.GetProduto(produto = id_produto, loja=id_loja) == {}:
            
            print(f"Não está presente na loja: {id_loja}")

            return

        print(f"Presente na loja {id_loja}")
                

        url = f"https://bling.com.br/Api/v2/produtoLoja/{id_loja}/{id_produto}/json/"

        xml = f'''<?xml version="1.0" encoding="UTF-8"?>
            <produtosLoja>
                <produtoLoja>
                <idLojaVirtual>{id_loja_virtual}</idLojaVirtual>
                <preco>
                    <preco>{preco}</preco>
                    <precoPromocional>{preco_promocional}</precoPromocional>
                </preco>
                <idFornecedor>{id_fornecedor}</idFornecedor>
                <idMarca>{id_marca}</idMarca>
                <categoriasLoja>
                    <categoriaLoja>
                        <idCategoria>{categoria_loja}</idCategoria>
                    </categoriaLoja>
                    <categoriaLoja>
                        <idCategoria>{categoria_loja}</idCategoria>
                    </categoriaLoja>
                </categoriasLoja>
            </produtoLoja>
            </produtosLoja>
        '''

        payload=f'apikey={self.apikey}&xml=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3CprodutosLoja%3E%0A%20%20%20%20%3CprodutoLoja%3E%0A%20%20%20%20%20%20%20%3CidLojaVirtual%3E123123%3C%2FidLojaVirtual%3E%0A%20%20%20%20%20%20%20%3Cpreco%3E%0A%20%20%20%20%20%20%20%20%20%20%20%3Cpreco%3E19%3C%2Fpreco%3E%0A%20%20%20%20%20%20%20%20%20%20%20%3CprecoPromocional%3E19%3C%2FprecoPromocional%3E%0A%20%20%20%20%20%20%20%3C%2Fpreco%3E%0A%20%20%20%20%20%20%20%3CidFornecedor%3E0%3C%2FidFornecedor%3E%0A%20%20%20%20%20%20%20%3CidMarca%3E0%3C%2FidMarca%3E%0A%20%20%20%20%20%20%20%3CcategoriasLoja%3E%0A%20%20%20%20%20%20%20%20%20%20%3CcategoriaLoja%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3CidCategoria%3E0%3C%2FidCategoria%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FcategoriaLoja%3E%0A%20%20%20%20%20%20%20%20%20%20%3CcategoriaLoja%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3CidCategoria%3E0%3C%2FidCategoria%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FcategoriaLoja%3E%0A%20%20%20%20%20%20%20%3C%2FcategoriasLoja%3E%0A%20%20%20%3C%2FprodutoLoja%3E%0A%3C%2FprodutosLoja%3E'
        
        
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.request("PUT", url, headers=headers, data=payload)


        */




}