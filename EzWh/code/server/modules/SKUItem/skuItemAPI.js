const skuItemDAO = require('./skuItemDAO');
const skuDAO = require('../SKU/skuDAO');
const db_sku = new skuDAO('EzWh.db');
const db_skuItem = new skuItemDAO('EzWh.db');

const { check, validationResult } = require('express-validator'); // validation middleware

module.exports.useApi = function useApi(app) {

    /* SKU ITEM */

    //GET /api/skuitems/
    app.get('/api/skuitems', async (req, res) => {
        try {
            const skuItems = await db_skuItem.getSKUItems();
            res.status(200).json(skuItems);
        } catch (e) {
            res.status(500).end();
        }
    });

    app.get('/api/skuitems/sku/:id', [
        check('id').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const sku = await db_sku.getSKUbyID(req.params.id);
            // check if is empty
            if (sku.length === 0) {
                return res.status(404).json([]).end();
            }
            const skuItems = await db_skuItem.getSKUItemsBySKUID(req.params.id);
            // check if is empty
            if (skuItems.length === 0) {
                return res.status(404).json([]).end();
            }
            res.status(200).json(skuItems);
        } catch (e) {
            res.status(500).end();
        }
    });

    app.get('/api/skuitems/:rfid', [
        check('rfid').isString().isLength({ min: 32, max: 32 })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const skuItems = await db_skuItem.getSKUItemsByRFID(req.params.rfid);
            // check if is empty
            if (skuItems.length === 0) {
                return res.status(404).end();
            }
            res.status(200).json(skuItems[0]);
        } catch (e) {
            res.status(500).end();
        }
    });

    //POST /api/skuitem/
    app.post('/api/skuitem/', [
        check('RFID').not().isEmpty(),
        check('RFID').isString().isLength({ min: 32, max: 32 }),
        check('DateOfStock').not().isEmpty(),
        check('DateOfStock').isString(),
        //check('DateOfStock').isDate(),
        check('SKUId').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        }

        const data = {
            "RFID": req.body.RFID,
            "SKUId": req.body.SKUId,
            "DateOfStock": req.body.DateOfStock,
        };

        try {

            //no SKU associated to SKUId)
            const sku = await db_sku.getSKUbyID(data.SKUId);
            if (sku.length === 0) {
                return res.status(404).end();
            }

            await db_skuItem.newSKUItem(data);
            res.status(201).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });


    //PUT /api/skuitems/:rfid
    app.put('/api/skuitems/:rfid', [
        check('newRFID').not().isEmpty(),
        check('newRFID').isString(),
        check('newDateOfStock').not().isEmpty(),
        check('newDateOfStock').isString(),
        check('newAvailable').isNumeric({min:0,max:1}),
        check('rfid').not().isEmpty(),

    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = {
            "newRFID": req.body.newRFID,
            "newDateOfStock": req.body.newDateOfStock,
            "newAvailable": req.body.newAvailable,
            "rfid": req.params.rfid
        };

        try {

            const skuitem = await db_skuItem.getSKUItemsByRFID(data.rfid);
            if (skuitem.length === 0) {
                res.status(404).end();
                return;
            }

            await db_skuItem.modifySkuItem(data);
            res.status(200).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });

    //DELETE /api/skuitems/:rfid
    app.delete('/api/skuitems/:rfid', [
        check('rfid').not().isEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const skuItem = await db_skuItem.getSKUItemsByRFID(req.params.rfid);
            // check if is empty
            if (skuItem.length === 0) {
                return res.status(422).end();
            }
            await db_skuItem.deleteSKUItem(req.params.rfid);
            res.status(204).end();
        }
        catch (e) {
            res.status(503).end();
            console.log(e);
        }
    });

    app.delete('/api/deleteSKUitems', async (req, res) => {
        try {
            await db_skuItem.deleteAllSKUItems();
            res.status(204).end();

        } catch (e) {
            res.status(500).end();
        }
    });
}