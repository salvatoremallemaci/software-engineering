const testResultDAO = require('./testResultDAO');
const skuItemDAO = require('../SKUItem/skuItemDAO');
const testDescriptorDAO = require('../testDescriptor/testDescriptorDAO');
const db_testDescriptor = new testDescriptorDAO('EzWh.db');
const db_skuItem = new skuItemDAO('EzWh.db');
const db_testResult = new testResultDAO('EzWh.db');
const { check, param, body, validationResult } = require('express-validator'); // validation middleware
module.exports.useApi = function useApi(app) {

    /* TEST RESULT */

    // GET /api/skuitems/:rfid/testResults
    app.get('/api/skuitems/:rfid/testResults', [param('rfid').isNumeric()], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const data = [req.params.rfid];
            let testResults = await db_skuItem.getSKUItemsByRFID(data[0]);

            if (testResults.length === 0) {
                res.status(404).end();
            } else {
                testResults = await db_testResult.getTestResults(data);
                res.json(testResults);
                return res.status(200).end();
            }


        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }

    });

    // GET /api/skuitems/:rfid/testResults/:id
    app.get('/api/skuitems/:rfid/testResults/:id',
        [param('rfid').isNumeric(),
        param('id').isNumeric()
        ], async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            try {
                const data = [req.params.rfid, req.params.id];

                const testResult = await db_testResult.getTestResult(data);

                if (typeof testResult === 'undefined') {
                    res.status(404).end();
                } else {
                    return res.status(200).json(testResult);
                }

            } catch (e) {
                console.log(e);
                return res.status(500).end();
            }
        });


    // POST /api/skuitems/testResult
    app.post('/api/skuitems/testResult', [
        body('rfid').isString().isLength({ min: 32, max: 32 }),
        body('idTestDescriptor').isNumeric(),
        body('Date').isString(),
        body('Result').isBoolean()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const data = [req.body.Date, req.body.Result, req.body.idTestDescriptor, req.body.rfid];

            const skuItems = await db_skuItem.getSKUItemsByRFID(req.body.rfid);
            // check if is empty
            if (skuItems.length === 0) {
                console.log("sku NonTrovato");
                return res.status(404).end();
            }

            const testDescriptor = await db_testDescriptor.getTestDescriptorByID(req.body.idTestDescriptor);
            if (testDescriptor.length === 0) {
                console.log("Test D NonTrovato");
                return res.status(404).end();
            }


            const result = await db_testResult.insertTestResult(data);
            if (result == 1) {
                res.status(201).end();
            } else {
                res.status(503).end();
            }


        } catch (e) {
            console.log(e);
            return res.status(503).end();
        }

    });


    // PUT /api/skuitems/:rfid/testResult/:id
    app.put('/api/skuitems/:rfid/testResult/:id', [
        check('rfid').isNumeric(),
        check('id').isNumeric(),
        body('newIdTestDescriptor').isNumeric(),
        body('newDate').isString(),
        body('newResult').isBoolean()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const data = [req.body.newDate, req.body.newIdTestDescriptor, req.body.newResult, req.params.id, req.params.rfid];

            const skuItems = await db_skuItem.getSKUItemsByRFID(req.params.rfid);
            // check if is empty
            if (skuItems.length === 0) {
                return res.status(404).end();
            }

            const testDescriptor = await db_testDescriptor.getTestDescriptorByID(req.body.newIdTestDescriptor);
            if (testDescriptor.length === 0) {
                return res.status(404).end();
            }


            const result = await db_testResult.updateTestResult(data);

            if (result == 1) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }

        } catch (e) {
            console.log(e);
            res.status(503).end();
        }

    });

    // DELETE /api/skuitems/:rfid/testResult/:id
    app.delete('/api/skuitems/:rfid/testResult/:id', [
        param('rfid').isNumeric(),
        param('id').isNumeric()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const data = [req.params.rfid, req.params.id];


            const result = await db_testResult.deleteTestResult(data);

            if (result == 0) {
                res.status(422).end();
            } else {
                res.status(204).end();
            }



        } catch (e) {
            console.log(e);
            res.status(503).end();
        }

    });

        // DELETE /api/testResult/deleteAll
        app.delete('/api/testResult/deleteAll', async (req, res) => {
            try {
                await db_testResult.deleteAllTestResult();
                res.status(204).end();
            } catch (err) {
                res.status(503).json({ error: `Database error during the deletion of all SKU.` });
            }
        });

}