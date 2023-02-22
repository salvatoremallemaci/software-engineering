
const skuDAO = require('../SKU/skuDAO');
const testDescriptorDAO = require('./testDescriptorDAO');
const { check, validationResult } = require('express-validator'); // validation middleware
const db_testDescriptor = new testDescriptorDAO('EzWh.db');
const db_sku = new skuDAO('EzWh.db');
module.exports.useApi = function useApi(app) {

    /* TEST DESCRIPTOR */

    //GET /api/testDescriptors
    app.get('/api/testDescriptors', async (req, res) => {
        try {
            const testDescriptors = await db_testDescriptor.getTestDescriptors();
            res.status(200).json(testDescriptors);
        } catch (e) {
            res.status(500).end();
        }
    });

    //GET /api/testDescriptors/:id
    app.get('/api/testDescriptors/:id', [
        check('id').isNumeric()
    ], async (req, res) => {

        //Validation of position through the algorithm failed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const testDescriptor = await db_testDescriptor.getTestDescriptorByID(req.params.id);
            if (testDescriptor.length === 0) {
                return res.status(404).end();
            }
            res.status(200).json(testDescriptor[0]);
        } catch (e) {
            res.status(500).end();
        }
    });

    //POST /api/testDescriptor
    app.post('/api/testDescriptor', [
        check('procedureDescription').not().isEmpty(),
        check('idSKU').isNumeric(),
        check('name').not().isEmpty(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        }

        const data = {
            "name": req.body.name,
            "idSKU": req.body.idSKU,
            "procedureDescription": req.body.procedureDescription,
        };

        try {
            //no SKU associated to SKUId)
            const sku = await db_sku.getSKUbyID(data.idSKU);
            if (sku.length === 0) {
                return res.status(404).end();
            }

            await db_testDescriptor.newTestDescriptor(data);
            res.status(201).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });


    //PUT /api/testDescriptor/:id
    app.put('/api/testDescriptor/:id', [
        check('newProcedureDescription').not().isEmpty(),
        check('newIdSKU').isNumeric(),
        check('newName').not().isEmpty(),
        check('id').isNumeric(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        }

        const data = {
            "id": req.params.id,
            "newName": req.body.newName,
            "newIdSKU": req.body.newIdSKU,
            "newProcedureDescription": req.body.newProcedureDescription,
        };

        try {
            //no SKU associated to SKUId)
            const sku = await db_sku.getSKUbyID(data.newIdSKU);
            if (sku.length === 0) {
                console.log("here");
                return res.status(404).end();
            }
            //no TD associated to id)
            const test = await db_testDescriptor.getTestDescriptorByID(data.id);
            if (test.length === 0) {
                console.log("or here");
                return res.status(404).end();
            }

            await db_testDescriptor.modifyTestDescriptor(data);
            res.status(200).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });

    //DELETE /api/testDescriptor/:id
    app.delete('/api/testDescriptor/:id', [
        check('id').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            await db_testDescriptor.deleteTestDescriptor(req.params.id);
            res.status(204).end();
        }
        catch (e) {
            res.status(503).end();
            console.log(e);
        }
    });

    app.delete('/api/deleteTestDescriptors', async (req, res) => {
        try {
            await db_testDescriptor.deleteAllTestDescriptor();
            res.status(204).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

}