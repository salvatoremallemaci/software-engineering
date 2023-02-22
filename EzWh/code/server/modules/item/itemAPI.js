
const itemDAO = require('./itemDAO');
const skuDAO = require('../SKU/skuDAO');
const db_sku = new skuDAO('EzWh.db');
const db_item = new itemDAO('EzWh.db');
const { check, param, validationResult } = require('express-validator'); // validation middleware

module.exports.useApi = function useApi(app) {

    /* ITEM */

    //GET /api/items
    app.get('/api/items', async (req, res) => {
        try {
            const items = await db_item.getItems();
            res.status(200).json(items);
        } catch (e) {
            res.status(503).end();
        }
    });

    //GET /api/items/:id/:supplierId
    app.get('/api/items/:id/:supplierId', [
        check('id').isInt({ min: 0 }),  param('supplierId').isInt()
    ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            try {
                const item = await db_item.getItem(req.params.id, req.params.supplierId);
                if (item.length == 0) {
                    return res.status(404).end();
                }
                res.json(item[0]);
            } catch (e) {
                res.status(503).end();
            }
        });

    //POST /api/item
    app.post('/api/item', [
        check('id').isInt({ min: 0 }),
        check('price').isFloat({ min: 0 }),
        check('description').isLength({ min: 1, max: 50 }),
        check('SKUId').isInt({ min: 0 }),
        check('supplierId').isInt({ min: 0 })

    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const item = {
            id: req.body.id,
            description: req.body.description,
            price: req.body.price,
            SKUId: req.body.SKUId,
            supplierId: req.body.supplierId
        };
        try {
            const sku = await db_sku.getSKUbyID(req.body.SKUId);
            if (sku.length == 0) {
                return res.status(404).end();
            }
            const itemSold = await db_item.getSupplierforSkuIdOrId(req.body.supplierId, item.id, item.SKUId);
            if (itemSold.length != 0) {
                return res.status(422).json({ error: " this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID" }).end();
            }
            await db_item.createItem(item);
            return res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: "Database error during the creation of item" });
        }
    });

    //Put /api/item/:id/:supplierId
    app.put('/api/item/:id/:supplierId', [param('id').isInt(), param('supplierId').isInt(), check('newPrice').isFloat({ min: 1 }),
    check('newDescription').isLength({ min: 1, max: 50 })], async (req, res) => {

        const item =
        {
            newDescription: req.body.newDescription,
            newPrice: req.body.newPrice
        }

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const item = await db_item.getItem(req.params.id, req.params.supplierId);
            if (item.length == 0) {
                return res.status(404).end();
            }
            res.json(item);
            await db_item.modifyItem(item, req.params.id, req.params.supplierId);
            res.status(200).end();;
        } catch (e) {
            res.status(503).end();
        }
    });

    //Delete /api/items/:id/:supplierId

    app.delete('/api/items/:id/:supplierId', [param('id').isInt(), param('supplierId').isInt()], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            await db_item.deleteItem(req.params.id, req.params.supplierId);
            res.status(204).end();;
        } catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });

    app.delete('/api/item/deleteAll', async (req, res) => {
        try {
            await db_item.deleteAllItems();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of all SKU.` });
        }
    });

}