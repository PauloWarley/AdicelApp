import axios from "axios";

var HOST = process.env.HOST

export default async function ApiValidator(req, res){

    // res.status(200).send("OK")
    for (var i = 0; i < 1; i++) {
        axios.post(`${HOST}/api/database`,  {query: "SELECT id FROM automate.pedidos limit 1"})
        .then(function (response) {
            console.log(response.data, i, 1)
        })
        .catch(function (error) {
            console.log(error, i)
        });
    }

    res.end("OK")
}