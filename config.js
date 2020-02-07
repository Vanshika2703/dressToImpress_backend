const sql = require('mssql')

const config = {
    user: 'shahnv',
    password: 'Pendo@123',
    server: 'golem.csse.rose-hulman.edu',
    database: 'DressToImpress',
    port: 1433
};

const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
    console.log('connected to MSSQL');
    return pool;
}).catch(err => console.log('Database Connection failed', err))

module.exports = {sql, poolPromise};