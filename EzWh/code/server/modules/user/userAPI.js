
const userDAO = require('./userDAO');
const db_user = new userDAO('EzWh.db');
const { check, param, body, validationResult } = require('express-validator'); // validation middleware
module.exports.useApi = function useApi(app) {
    
    /* USER */
    
    //GET /api/suppliers
    app.get('/api/suppliers', async (req, res) => {
        try {
            const suppliers = await db_user.getStoredSuppliers();
            res.status(200).json(suppliers);
        } catch (e) {
            res.status(500).end();
        }
    });

    //GET /api/users
    app.get('/api/users', async (req, res) => {
        try {
            const users = await db_user.getStoredUsers();
            res.status(200).json(users);
        } catch (e) {
            res.status(500).end();
        }
    });

    // POST /api/newUser
    app.post('/api/newUser', [
        check('name').isString(),
        check('surname').isString(),
        check('password').isLength({ min: 8, max: 30 }),
        check('username').isEmail(),
        check('type').isString()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = {
            "username": req.body.username,
            "name": req.body.name,
            "surname": req.body.surname,
            "password": req.body.password,
            "type": req.body.type
        };

        if (user.type == "manager" || user.type == "administrator") {
            res.status(422).json({ error: `Attempt to create manager or administrator accounts` }).end();
            return;
        }

        const verify = await db_user.getUserbyUsernameAndType(user.username, user.type);
        if (verify.length != 0) {
            res.status(409).json({ error: `User with same mail and type already exists` }).end();
            return;
        }

        /*
        const verify = await db_user.verifySameMailAndType(user);
        if (verify.length != 0) {
            res.status(409).json({ error: `User with same mail and type already exists` }).end();
            return;
        }
        */

        try {
            await db_user.newUser(user);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the creation of user ${user.username}.` });
        }
    });

    // PUT /api/users/:username
    app.put('/api/users/:username', [
        check('username').isEmail(),
        check('oldType').not().isEmpty(),
        check('newType').not().isEmpty(),
    ], async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = await db_user.getUserbyUsername(req.params['username']);

        if (user.length == 0) {
            res.status(404).json({ error: `Wrong username or user doesn't exists` });
            return;
        }

        if (user[0].type != req.body.oldType) {
            res.status(404).json({ error: `oldType field doesn't match` });
            return;
        }

        if (req.body.newType == "manager" || req.body.newType == "administrator ") {
            res.status(422).json({ error: `Attempt to modify rights to administrator or manager` });
            return;
        }


        try {
            await db_user.updateRights(user[0].username, req.body.newType);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the update of user ${req.params.username}.` });
        }

    });

    // DELETE /api/users/:username/:type
    app.delete('/api/users/:username/:type', [
        check('username').isEmail(),
        check('type').isString()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (req.params['type'] == "manager" || req.params['type'] == "administrator") {
            res.status(422).json({ error: `Attempt to delete a manager/administrator` });
            return;
        }

        
        if ( req.params['type'] !== "qualityEmployee" && req.params['type'] !== "clerk" && req.params['type'] !== "customer" && req.params['type'] !== "supplier" && req.params['type'] !== "deliveryEmployee"){
            return res.status(422).json({ error: `Type of user is not correct` });
        }
        

        const user = await db_user.getUserbyUsernameAndType(req.params['username'], req.params['type']);

        /*if (user.length == 0) {
            res.status(404).end();         
            return;
        }*/

        try {
            await db_user.deleteUser(req.params['username'], req.params['type']);
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of user ${req.params.username}.` });
        }

    });

    // DELETE /api/users/allUsers
    app.delete('/api/users/allUsers', async (req, res) => {
        try {
            await db_user.deleteAllUsers();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of all users.` });
        }

    });
 

    // GET /api/userinfo
    app.get('/api/userinfo', async (req, res) => {
        try {
            // DOPO LE SESSIONS
            res.status(200).json(user);
        } catch (e) {
            res.status(500).end();
        }
    });

}