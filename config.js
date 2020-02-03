const sql = require('mssql')

const config = {
    user: 'reddyvs',
    password: 'AmVr1127',
    server: 'golem.csse.rose-hulman.edu',
    database: 'DressToImpress',
    port: 1433
};

const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
    console.log('connected to MSSQL');
    return pool;
}).catch(err => console.log('Database Connection failed', err))

module.exports = {sql, poolPromise};