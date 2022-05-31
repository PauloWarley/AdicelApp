import axios from "axios"
var HOST = process.env.HOST

export default async function InsertPackingList(req, res){

    /* [id_romaneio, id_pedido]   */

    async function postPackingList(){
        var orders = req.body.orders
        
        var query = `
            INSERT INTO romaneios (
                created_date,
                modified_date,
                changed_by
            )
            
            VALUES (
                now(),
                now(),
                '0'
            );

        `
        var data = JSON.stringify({
            "query": query
        });

        var config = {
            method: 'post',
            url: `${HOST}/api/database`,
            headers: { 
                'Content-Type': 'application/json'
        },
        data : data
        };

        await axios(config)
        .then(async function (response) {
            var id = response.data["insertId"]

            for(var i in orders) {        
                var query = `
                    UPDATE 
                        automate.pedidos
                    SET  romaneio='${id}', modified_date=now(), changed_by='0' WHERE (id = '${orders[i]}');
                    
                `

                var data = JSON.stringify({
                    "query": query
                });

                var config = {
                    method: 'post',
                    url: `${HOST}/api/database`,
                    headers: { 
                        'Content-Type': 'application/json'
                },
                data : data
                };


                await axios(config)
                .then(async function () {
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            
            console.log("res.status(200).json", orders, id)
            res.status(200).json({idRomaneio: id, orders: orders})

        })
        .catch(function (error) {
            console.log(error);
        });
        
    }

    async function putPackingList(){

        var id_packing_list = req.query.id
        var currentSituation = req.query.status

        if (req.query.status == "checked") {
            currentSituation = 1
        }
        else if(req.query.status == "tagged") {
            currentSituation = 2
        }

        async function changeStatus(id_packing_list, currentSituation){

            if(currentSituation === undefined){
                return {affectedRows: 0}
            }
            else{
                var query = `
                UPDATE romaneios
                    SET
                        modified_date = now(),
                        status = ${currentSituation}
                where id = ${id_packing_list};
                
                `
                var data = {
                    "query": query
                }

                

                var response = await (axios.post(`${HOST}/api/database`, data))

                return response.data
            }

            
                

        }

        var update = await changeStatus(id_packing_list, currentSituation)
        
        // update.affectedRows = 1

        var query = `

            SELECT
                TIMESTAMPDIFF (SECOND, romaneios.created_date, romaneios.modified_date) AS seconds_qntd,
                pedidos.id,
                pedidos_produtos.ID_produto,
                pedidos_produtos.Quantidade,
                pedidos.Situacao
            FROM pedidos_produtos
            INNER JOIN pedidos
            ON
                pedidos_produtos.ID_pedido = pedidos.ID_pedido and
                pedidos.romaneio = ${id_packing_list}
            INNER JOIN produtos
            ON
                pedidos_produtos.ID_produto = produtos.Codigo
            INNER JOIN romaneios
            ON
                romaneios.id  = pedidos.romaneio

        `
        var data = {
            "query": query
        }

        var response = (await axios.post(`${HOST}/api/database`, data)).data

        if (response.length === 0){
            res.status(200).json({
                timeInHours: 0,
                productQntd: 0,
                orderQntd: 0,
                missingOrderQntd: 0                            
            })
            return
        }

        var timeInSeconds = response[0].seconds_qntd

        var productQntd = 0

        for (var i in response) productQntd = productQntd + response[i].Quantidade;

        var missingOrderQntd = 0, missingOrderQntdAux = []
        
        
        for (var i in response){

            if(response[i].Situacao === "Em falta"){
                
                if ( missingOrderQntdAux.indexOf(response[i].id) === -1){
                    missingOrderQntdAux.push(response[i].id)
                }
                
            }
        }

        missingOrderQntd = missingOrderQntdAux.length

        var date = new Date(null);

        date.setSeconds(timeInSeconds);

        var timeInHours = date.toISOString().substr(11, 8);

        res.status(200).json({
            timeInHours: timeInHours,
            productQntd: productQntd,
            orderQntd: response.length,
            missingOrderQntd: missingOrderQntd,
            posted: update.affectedRows >= 1
        })


        /*
            Tempo gasto
            Numero de Pedidos
            Numero de Produtos
            Pedidos em falta
            Ranking
        */

    


    }

    async function getPackingList(){
        if (req.query.id === undefined){

            var query = `
            select romaneios.id, 
                romaneios.status, 
                romaneios.description, 
                romaneios.created_date 
            from romaneios 
            where romaneios.status <> -1
            order by 1 desc limit 10
            `
            // console.log(query)
            var data = JSON.stringify({
                "query": query
            });

            var config = {
                method: 'post',
                url: `${HOST}/api/database`,
                headers: { 
                    'Content-Type': 'application/json'
            },
            data : data
            };

            await axios(config)
            .then(async function (response) {
                res.status(200).json(response.data)
                // console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
        else{

            // console.log(req.query.id)

            var query = `
                select romaneios.id, 
                    romaneios.status, 
                    romaneios.description, 
                    romaneios.created_date 
                from romaneios 
                where id = ${req.query.id}
                order by 1 desc limit 10
            `
            // console.log(query)
            var data = JSON.stringify({
                "query": query
            });

            var config = {
                method: 'post',
                url: `${HOST}/api/database`,
                headers: { 
                    'Content-Type': 'application/json'
            },
            data : data
            };

            await axios(config)
            .then(async function (response) {
                res.status(200).json(response.data)
                // console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
        }

        

    }

    if ( req.method === "POST" ){
        await postPackingList()
    }
    else if (req.method === "PUT"){
        await putPackingList()
    }
    else if (req.method === "GET"){
        // console.log(req.method)
        await getPackingList()
    }
}