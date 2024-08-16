
// Import the mysql package
const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web3_accounts'
});

// Function to execute queries
async function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error)
                reject(error);
                return;
            }

            connection.query(sql, params, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(results);
                connection.release();
            });
        });
    });
}

module.exports = { query };
