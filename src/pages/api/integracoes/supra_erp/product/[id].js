import axios from "axios"

const HOST = process.env.HOST


export default async function ProductSupra(req, res){

    var id = req.query.id

    var data = {
        query: `SELECT TOP (1000) 
                [codigo],
                [nome],
                [Codigo_barra],
                [unid_unidade],
                [quantidade_unidade],
                [quantidade_estoque],
                [estoque_minimo],
                [estoque_maximo],
                [peso_liquido]
                FROM [SGC].[dbo].[produto]
                where data_exclusao is null and [codigo]=${("000000" + id).slice(-6)}`
    }

    var response = await axios.post(`${HOST}/api/integracoes/supra_erp/database`, data)

    var product_list = response.data

    return new Promise( (resolve, reject) => {

        res.status(200).json(product_list.recordsets[0])
        resolve()
    }
    )
}