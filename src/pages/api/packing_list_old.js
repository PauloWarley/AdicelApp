import axios from "axios"
var HOST = process.env.HOST

export default async function InsertPackingList(req, res){

    /* [id_romaneio, id_pedido]   */

    async function postPackingList(){
        var orders = [1,2,3]
        orders = [1]

        orders = req.body.orders
        
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

        var query = `
            SELECT max(id) FROM romaneios;
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

            var maxId = response.data[0]['max(id)']

            var currentSituation = 2

            var query = `
                UPDATE romaneios
                    SET
                        modified_date = now(),
                        status = ${currentSituation}
                where id = ${maxId};
                
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

                if (response.data.affectedRows >= 1){

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
                            pedidos.romaneio = ${maxId}
                        INNER JOIN produtos
                        ON
                            pedidos_produtos.ID_produto = produtos.Codigo
                        INNER JOIN romaneios
                        ON
                            romaneios.id  = pedidos.romaneio

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
    
                        var timeInSeconds = response.data[0].seconds_qntd

                        var productQntd = 0

                        for (var i in response.data) productQntd = productQntd + response.data[i].Quantidade;

                        var missingOrderQntd = 0, missingOrderQntdAux = []
                        
                        
                        for (var i in response.data){

                            if(response.data[i].Situacao === "Em falta"){
                                
                                if ( missingOrderQntdAux.indexOf(response.data[i].id) === -1){
                                    missingOrderQntdAux.push(response.data[i].id)
                                }
                                
                            }
                        }

                        missingOrderQntd = missingOrderQntdAux.length

                        var date = new Date(null);

                        date.setSeconds(timeInSeconds);

                        var timeInHours = date.toISOString().substr(11, 8);

                        // console.log(timeInSeconds, productQntd, missingOrderQntdAux, response.data)
    
                        res.status(200).json({
                            timeInHours: timeInHours,
                            productQntd: productQntd,
                            orderQntd: response.data.length,
                            missingOrderQntd: missingOrderQntd                            
                        })

                        console.log({
                            timeInHours: timeInHours,
                            productQntd: productQntd,
                            orderQntd: response.data.length,
                            missingOrderQntd: missingOrderQntd                            
                        })

                        /*
                            Tempo gasto
                            Numero de Pedidos
                            Numero de Produtos
                            Pedidos em falta
                            Ranking
                        */
        
                    })
                    .catch(function (error) {
                        console.log(error);
                    });



                }
                else {
                    res.end(400)
                }

            })
            .catch(function (error) {
                console.log(error);
            });


        })
        .catch(function (error) {
            console.log(error);
        });
        
        

        
    }

    if ( req.method === "POST" ){
        await postPackingList()
    }
    if (req.method === "PUT"){
        await putPackingList()
    }
}