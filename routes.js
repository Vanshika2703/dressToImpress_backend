var express = require('express');
var router = express.Router();

const {sql, poolPromise} = require('./config');

router.post('/new-user', async (req, res, next) => {
    const user = req.body.user;
    console.log('User is being registered')
    //const pool = await poolPromise;
    // const query = await pool.request()
    //                     .input('Username', sql.VarChar(20), req.body.username)
    //                     .input('Password', sql.VarChar(25), req.body.password)
    //                     .input('Fname', sql.VarChar(20), req.body.fname)
    //                     .input('Lname', sql.VarChar(30), req.body.lname)
    //                     .input('DOB', sql.Date, req.body.date)
    //                     .execute('insert_User');
    res.end(JSON.stringify({success: true}));
    console.log('User is registered')
});

router.get('/users', async (req, res, next) => {
    const pool = await poolPromise;
    const query = await pool.request()
                        .query('SELECT * FROM [User]');

    // if (query.recordset.length > 0) {
        res.end(JSON.stringify({ success: true, result: query.recordset }))
    // } else {
    //     res.end(JSON.stringify({ success: false, result: 'Empty'}))
    // }
})

module.exports = router;