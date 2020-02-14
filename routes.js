console.log("Entered the top")
var express = require('express');
var router = express.Router();

const {sql, poolPromise} = require('./config');

router.post('/user', async (req, res, next) => {
    console.log('User is being registered')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Username', sql.VarChar(20), req.body.username)
                        .input('Password', sql.VarChar(25), req.body.password)
                        .input('Fname', sql.VarChar(20), req.body.fname)
                        .input('Lname', sql.VarChar(30), req.body.lname)
                        .input('DOB', sql.Date, req.body.dob)
                        .input('Number',sql.Int,req.body.number)
                        .input('Street',sql.VarChar(60),req.body.street)
                        .input('AddrState',sql.VarChar(2),req.body.state)
                        .input('Zipcode',sql.Int,req.body.zip)
                        .execute('insert_User');
     if (query.returnValue == 0) {
        res.end(JSON.stringify({ success: true, items: query.recordset }))
     } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
});

router.post('/item', async (req, res, next) => {
    console.log('Item is being inserted')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Color', sql.VarChar(20), req.body.Color)
                        .input('ItemType', sql.VarChar(50), req.body.ItemType)
                        .input('Name', sql.VarChar(50), req.body.Name)
                        .input('Cost', sql.Money, rcdeq.body.Cost)
                        .input('Description', sql.VarChar(80), req.body.Description)
                        .input('Display', sql.VarChar(1000), req.body.Display)
                        .execute('insert_Item');
     if (query.returnValue == 0) {
        res.end(JSON.stringify({ success: true, items: query.recordset }))
     } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
});

router.get('/items', async(req, res, next) => {
    const pool = await poolPromise;
    const query = await pool.request()
                        .query('SELECT * FROM [dbo].[getItems] ()');

    if (query.recordset.length > 0) {
        res.end(JSON.stringify({ success: true, items: query.recordset }))
    } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
})

// router.get('/items', async(req, res, next) => {
//     const pool = await poolPromise;
//     const query = await pool.request()
//                         .query('SELECT * FROM [dbo].[getItems] ()');

//     if (query.recordset.length > 0) {
//         res.end(JSON.stringify({ success: true, items: query.recordset }))
//     } else {
//         res.end(JSON.stringify({ success: false, result: 'Empty'}))
//     }
// })

router.get('/user', async(req, res, next) => {
    // req.query.username // put this into DB call
    // req.query.password // put this into DB call
    console.log(req)
;    const pool = await poolPromise;
    const query = await pool.request()
            .input('Username', sql.VarChar(20), req.query.username)
            .input('UserPassword', sql.VarChar(25), req.query.password)
            .execute('CheckLogin');
    console.log(query);
    if (query.returnValue == 1 ) {
        console.log(query.returnValue)
        res.end(JSON.stringify({ success: true, items: query.recordset }))
    } else {
        console.log(query.returnValue)
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
})
module.exports = router;