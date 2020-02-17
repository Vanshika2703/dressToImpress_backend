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
                        .input('City', sql.VarChar(30), req.body.city)
                        .input('AddrState',sql.VarChar(2),req.body.state)
                        .input('Zipcode',sql.Int,req.body.zip)
                        .input('CardNumber',sql.Int,req.body.cardnumber)
                        .input('ExpiryDate',sql.Date,req.body.expirydate)

                        .execute('insert_User');
     if (query.returnValue == 0) {
        res.end(JSON.stringify({ success: true,  number: 0}))
     } else if (query.returnValue == 1){
        res.end(JSON.stringify({ success: false, number: 1}))
    }
    else if (query.returnValue == 2)
    {
        res.end(JSON.stringify({ success: false,  number: 2}))
    }
});

router.post('/item', async (req, res, next) => {
    console.log('Item is being inserted')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Color', sql.VarChar(20), req.body.Color)
                        .input('ItemType', sql.VarChar(50), req.body.ItemType)
                        .input('Name', sql.VarChar(50), req.body.Name)
                        .input('Cost', sql.Money, req.body.Cost)
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


router.get('/itemsSorted', async(req, res, next) => {
    console.log("im inside!");
    const pool = await poolPromise;
    const query = await pool.request()
        .input('Color', sql.VarChar(20), req.body.Color)
        .input('ItemType', sql.VarChar(50), req.body.ItemType)
        .input('Cost', sql.Money, rcdeq.body.Cost)
        .execute('getItemsorted');
        if (query.returnValue == 0) 
        {
            res.end(JSON.stringify({ success: true, items: query.recordset}))
        } 
        else if (query.returnValue == 1)
        {
            res.end(JSON.stringify({ success: false, result: 'Empty'}))
        }
}) 

router.post('/order', async (req, res, next) => {
    console.log('Order is being placed')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Username', sql.VarChar(20), req.body.username)
                        .input('Date', sql.DateTime, req.body.date)
                        .input('ItemID', sql.Int, req.body.id)
                        .execute('insert_Order');
    if (query.returnValue == 0) 
    {
        res.end(JSON.stringify({ success: true, items: query.recordset, number: 1}))
    } 
    else if (query.returnValue == 1)
    {
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 1}))
    }
    else if (query.returnValue == 2)
    {
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 2}))
    }
});

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
    if (query.returnValue == 1 ) 
    {
        console.log(query.returnValue)
        res.end(JSON.stringify({ success: true, number: 1, username: req.query.username }))
    } 
    else if (query.returnValue == 2)
    {
        console.log(query.returnValue)
        res.end(JSON.stringify({ success: true, items: query.recordset, number: 2 }))
    }
    else 
    {
        console.log(query.returnValue)
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 0}))
    }
})
module.exports = router;