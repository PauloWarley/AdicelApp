//root root

async function connect(){

    if (global.connection && global.connection.state != "disconnected")
        return global.connection;
    
    const mysql = require("mysql2/promise");
    
    const connection = await mysql.createConnection("mysql://root:root@site:3306/Automate")
    
    console.log('Conectou ao MYSQL!');
    global.connection = connection;
    return connection;

}

connect();

async function selectCustomers(){

    const conn = await connect();
    const [rows] = conn.query("SELECT * FROM ESTOQUE");
    return await rows;


}

module.exports = {selectCustomers}