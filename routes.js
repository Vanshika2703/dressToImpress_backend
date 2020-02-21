const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const {sql, poolPromise} = require('./config');

router.post('/user', async (req, res, next) => {
    console.log('User is being registered')
    const pword = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pword, salt);

    const cvv = req.body.cvv;
    var saltcvv = bcrypt.genSaltSync(10);
    var hashcvv = bcrypt.hashSync(cvv, saltcvv);

    console.log('hash :', hash);
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Username', sql.VarChar(20), req.body.username)
                        .input('Password', sql.VarChar(100), hash)
                        .input('Fname', sql.VarChar(20), req.body.fname)
                        .input('Lname', sql.VarChar(30), req.body.lname)
                        .input('DOB', sql.Date, req.body.dob)
                        .input('Number',sql.Int,req.body.number)
                        .input('Street',sql.VarChar(60),req.body.street)
                        .input('City', sql.VarChar(30), req.body.city)
                        .input('AddrState',sql.VarChar(2),req.body.state)
                        .input('Zipcode',sql.Int,req.body.zip)
                        .input('CardNumber',sql.BigInt,req.body.cardnumber)
                        .input('ExpiryDate',sql.Date,req.body.expirydate)
                        .input('cvv',sql.VarChar(100), hashcvv)
                        .execute('insert_User');

    console.log('query', query);
    console.log('query.returnValue :', query.returnValue);

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
    } 
    else if(query.returnValue == 1)
    {
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 1}))
    }
    else(query.returnValue == 2)
    {
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 2}))
    }
});

router.post('/user/profile/cardModal', async (req, res, next) => {
    console.log('Card stuff is being updated')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('username', sql.VarChar(20), req.body.username)
                        .input('number', sql.Int, req.body.Number)
                        .input('date', sql.Date, req.body.date)
                        .execute('updateCard');
    if (query.returnValue == 0) {
        res.end(JSON.stringify({ success: true, items: query.recordset }))
    } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
});

router.post('/user/profile/addrModal', async (req, res, next) => {
    console.log('address is being updated')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('username', sql.VarChar(20), req.body.username)
                        .input('number', sql.Int, req.body.Number)
                        .input('street', sql.VarChar(50), req.body.Street)
                        .input('city', sql.VarChar(2), req.body.City)
                        .input('state', sql.VarChar(80), req.body.State)
                        .input('zip', sql.Int, req.body.ZipCode)
                        .execute('updateAddress');
    if (query.returnValue == 0) {
        res.end(JSON.stringify({ success: true, items: query.recordset}))
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

router.get('/user/profile', async(req, res, next) => {
    console.log('entering info query');
    console.log('req.query', req.query);
    const pool = await poolPromise;
    const result = await pool.request()
                        .input('userName', sql.VarChar(20), req.query.username)
                        .execute('getAddressAndLast4Card');
                        console.log(result)
    if (result.recordset.length > 0) {
        res.end(JSON.stringify({ success: true, items: result.recordset, cardend: result.returnValue }))
    } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
})

router.get('/cart', async(req, res, next) => {
    console.log('entering cart query');
    console.log('req.query', req.query);
    const pool = await poolPromise;
    const result = await pool.request()
                        .input('Username', sql.VarChar(20), req.query.username)
                        .query("SELECT * FROM [dbo].[getCartItems] (@Username)");
    if (result.recordset.length > 0) {
        res.end(JSON.stringify({ success: true, items: result.recordset }))
    } else {
        res.end(JSON.stringify({ success: false, result: 'Empty'}))
    }
})

router.get('/item/sorted', async(req, res, next) => {
    const pool = await poolPromise;
    const query = await pool.request()
        .input('Color', sql.VarChar(20), req.query.Color)
        .input('ItemType', sql.VarChar(50), req.query.ItemType)
        .input('Cost', sql.Money, req.query.Cost)
        .execute('getItemsorted');
        if (query.returnValue == 0) 
        {
            res.end(JSON.stringify({ success: true, items: query.recordset}))
            console.log(query.recordset)
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
                        .execute('insert_Order');
    if (query.returnValue == 0) 
    {
        res.end(JSON.stringify({ success: true, items: query.recordset, number: 1}))
    } 
    else if (query.returnValue == 1){
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 1}))
    }
    else if (query.returnValue == 2)
    {
        res.end(JSON.stringify({ success: false, result: 'Empty', number: 2}))
    }
});

router.post('/cart', async (req, res, next) => {
    console.log('Item is attemping to be placed in the cart')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('Username', sql.VarChar(20), req.body.username)
                        .input('ItemID', sql.Int, req.body.id)
                        .execute('insert_Cart');
    if (query.returnValue == 0) 
    {
        res.end(JSON.stringify({ success: true}))
    } 
    else if(query.returnValue == 1)
    {
        res.end(JSON.stringify({ success: false}))
    }
});

router.delete('/cart', async (req, res, next) => {
    console.log('Item is attemping to be deleted from the cart')
    const pool = await poolPromise;
    const query = await pool.request()
                        .input('ID', sql.Int, req.body.id)
                        .input('Username', sql.VarChar(20), req.body.username)
                        .execute('delete_CartItem');
    if (query.returnValue == 0) 
    {
        res.end(JSON.stringify({ success: true}))
    } 
    else if(query.returnValue == 1)
    {
        res.end(JSON.stringify({ success: false}))
    }
});

router.get('/user', async(req, res, next) => {
    console.log('logging in a user')
    const pool = await poolPromise;
    const result = await pool.request()
            .input('Username', sql.VarChar(20), req.query.username)
            .input('UserPassword', sql.VarChar(100), req.query.password)
            .query('SELECT * FROM [dbo].[loginUser] (@Username , @UserPassword)')
    if(result.recordset.length > 0)
    {
        // console.log('result.recordset :', result.recordset[0].Username);
        const hashpassword = result.recordset[0].UserPassword;
        delete result.recordset[0].UserPassword;
        bcrypt.compare(req.query.password, hashpassword, function(err, resu) {
            if (resu == true) {
                // console.log('username :', result.recordset);
                res.end(JSON.stringify({ success: true, user: result.recordset[0].Username }));
            } else {
                res.end(JSON.stringify({ success: false}))
            }
        })
    } 
    else
    {
        res.end(JSON.stringify({ success: false }))
    }

})
module.exports = router;