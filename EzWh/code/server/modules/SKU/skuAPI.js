const positionDAO = require('../position/positionDAO');
const testDescriptorDAO = require('../testDescriptor/testDescriptorDAO');
const skuDAO = require('./skuDAO');
const db_sku = new skuDAO('EzWh.db');
const db_position = new positionDAO('EzWh.db');
const db_testDescriptor = new testDescriptorDAO('EzWh.db');

const { check, validationResult } = require('express-validator'); // validation middleware
module.exports.useApi = function useApi(app) {

    /* SKU */

    //GET /api/skus/
    app.get('/api/skus', async (req, res) => {
        try {
            const skus = await db_sku.getStoredSKUS();
            const testArray = await db_testDescriptor.getTestDescriptors();
            skus.forEach(element => {
                element.testDescriptors = testArray.filter((T) => T.idSKU === element.id).map((T) => T.id);
            });
            res.status(200).json(skus);
        } catch (e) {
            res.status(500).end();
        }
    });

    //GET /api/skus/:id
    app.get('/api/skus/:id', [
        check('id').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const sku = await db_sku.getSKUbyID(req.params.id);
            const testArray = await db_testDescriptor.getTestDescriptors();
            // check if is empty
            if (sku.length === 0) {
                return res.status(404).end();
            }
            sku[0].testDescriptors = testArray.filter((T) => T.idSKU === sku[0].id).map((T) => T.id);
            delete sku[0].id;
            res.status(200).json(sku);
        } catch (e) {
            res.status(500).end();
        }
    });

    //POST /api/sku/
    app.post('/api/sku/', [
        check('description').not().isEmpty(),
        check('notes').not().isEmpty(),
        check('weight').isInt({min:0}),
        check('volume').isInt({min:0}),
        check('price').isInt({min:0}),
        check('availableQuantity').isInt({min:0})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        }

        const sku = {
            "description": req.body.description,
            "notes": req.body.notes,
            "weight": req.body.weight,
            "volume": req.body.volume,
            "price": req.body.price,
            "availableQuantity": req.body.availableQuantity
        };

        try {
            await db_sku.newSKU(sku);
            res.status(201).end();
        }
        catch (e) {
            res.status(503).end();
        }
    });

    //PUT /api/sku/:id
    app.put('/api/sku/:id', [
        check('newDescription').not().isEmpty(),
        check('newNotes').not().isEmpty(),
        check('newWeight').isInt({min:0}),
        check('newVolume').isInt({min:0}),
        check('newPrice').isInt({min:0}),
        check('newAvailableQuantity').isInt({min:0}),
        check('id').isInt()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = {
            "newDescription": req.body.newDescription,
            "newWeight": req.body.newWeight,
            "newAvailableQuantity": req.body.newAvailableQuantity,
            "newVolume": req.body.newVolume,
            "newPrice": req.body.newPrice,
            "newNotes": req.body.newNotes,
            "skuID": req.params.id
        };

        try {
            const sku = await db_sku.getSKUbyID(req.params.id);
            if (sku.length === 0) {
                res.status(404).end();
                return;
            }

            //Position is already assigned to a sku
            if (sku[0].position !== null) {
                const position = await db_position.getPositionByID(sku[0].position);
                if (position.length === 0) {
                    return res.status(404).end();
                }
                data.position = position[0].positionID;
                data.volumeTOT = data.newVolume * data.newAvailableQuantity;
                data.weightTOT = data.newWeight * data.newAvailableQuantity;
                if (data.volumeTOT > (data.position.maxVolume - data.position.occupiedVolume)) {
                    return res.status(422).end();
                }

                if (data.weightTOT > (data.position.maxWeight - data.position.occupiedVolume)) {
                    return res.status(422).end();
                }

            }

            await db_sku.modifySku(data);
            res.status(200).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });


    //PUT /api/sku/:id/position
    app.put('/api/sku/:id/position', [
        check('position').isString().isLength({ min: 12, max: 12 }),
        check('id').isInt()
    ], async (req, res) => {

        //Validation of position through the algorithm failed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let data = {
            "skuID": req.params.id,
            "positionID": req.body.position
        };


        try {

            //Position not existing 
            const position = await db_position.getPositionByID(data.positionID);
            if (position.length === 0) {
                return res.status(404).end();
            }
            data.position = position[0];

            //Position is already assigned to a sku
            if (data.position.skuID !== null) {
                return res.status(422).json("Position is already assigned to a sku").end();
            }

            //SKU not existing
            const sku = await db_sku.getSKUbyID(data.skuID);
            if (sku.length === 0) {
                return res.status(404).end();
            }
            data.sku = sku[0];

            //Position is already assigned to a sku
            if (data.sku.position !== null) {
                return res.status(422).json("Position is already assigned to a sku").end();
            }


            data.newVolume = data.sku.volume * data.sku.availableQuantity;
            data.newWeight = data.sku.weight * data.sku.availableQuantity;

            if (data.newVolume > (data.position.maxVolume - data.position.occupiedVolume)) {
                return res.status(422).end();
            }

            if (data.newWeight > (data.position.maxWeight - data.position.occupiedVolume)) {
                return res.status(422).end();
            }

            await db_sku.modifySkuPosition(data);
            res.status(200).end();
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });

    //DELETE /api/skus/:id
    app.delete('/api/skus/:id', [
        check('id').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const sku = await db_sku.getSKUbyID(req.params.id);
            // // check if is empty
            if (sku.length === 0) {
                 return res.status(204).end();
            }
            
            if (sku[0].position !== null) {
                db_sku.deletePositionSKU(sku[0].positionID, sku[0].availableQuantity);
            }
            await db_sku.deleteSKU(req.params.id);
            res.status(204).end();
        }
        catch (e) {
            res.status(503).end();
            console.log(e);
        }
    });

    // DELETE /api/sku/deleteAll
    app.delete('/api/sku/deleteAll', async (req, res) => {
        try {
            await db_sku.deleteAllSKUs();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of all SKU.` });
        }

    });

}