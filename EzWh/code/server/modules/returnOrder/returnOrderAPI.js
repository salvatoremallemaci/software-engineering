
const returnOrderDAO = require('./returnOrderDAO');
const restockOrderDAO = require('../restockOrder/restockOrderDAO');
const itemDAO = require('../item/itemDAO');
const skuItemDAO = require('../SKUItem/skuItemDAO');

const db_returnOrder = new returnOrderDAO('EzWh.db');
const db_SKUItem = new skuItemDAO('EzWh.db');
const db_item = new itemDAO('EzWh.db');
const db_restockOrder = new restockOrderDAO('EzWh.db');
const { check, validationResult } = require('express-validator'); // validation middleware


module.exports.useApi = function useApi(app) {

    /* RETURN ORDER */

    //GET /api/returnOrders
    app.get('/api/returnOrders', async (req, res) => {
        try {
            const returnOrders = await db_returnOrder.getReturnOrders();
            const testArray = await db_returnOrder.getProductsOfReturnOrder();

            returnOrders.forEach(element => {
                element.products = testArray.filter((T) => T.returnOrderId === element.id)
                    .map(
                        (T) => T
                    )
            });


            for (const element of returnOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].returnOrderId;
                }
            }


            res.status(200).json(returnOrders);
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    // GET /api/returnOrders/:id
    app.get('/api/returnOrders/:id', [
        check('id').isNumeric()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const returnOrders = await db_returnOrder.getReturnOrderById(req.params['id']);
            if (returnOrders.length == 0) {
                res.status(404).json({ error: `No return order associated to id` });
                return;
            }
            const testArray = await db_returnOrder.getProductsOfReturnOrder();

            returnOrders.forEach(element => {
                element.products = testArray.filter((T) => T.returnOrderId === element.id)
                    .map(
                        (T) => T
                    )
            });

            for (const element of returnOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].returnOrderId;
                }
            }

            res.status(200).json(returnOrders[0]);
        } catch (e) {
            res.status(500).end();
        }
    });

    // POST /api/returnOrder
    app.post('/api/returnOrder', [
        check('returnDate').isString(),
        check('products').not().isEmpty(),
        check('restockOrderId').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const returnOrder = {
            "returnDate": req.body.returnDate,
            "products": req.body.products,
            "restockOrderId": req.body.restockOrderId
        };

        try {
            const order = await db_restockOrder.getRestockOrder(returnOrder.restockOrderId);
            if (order.length==0) {
                return res.status(404).end();
            }
            await db_returnOrder.newReturnOrder(returnOrder);
            const returnOrderID = await db_returnOrder.getLastIdOfReturnOrders();


            for (const element of req.body.products) {
                let temp = await db_SKUItem.getSKUItems();
                temp.filter((t)=>t.RFID===element.RFID)
                if(temp.length===0){
                    return res.status(422).end();
                }


                temp = await db_item.getItemBySKUID(element.SKUId);
                if(temp[0].id !== element.itemId){
                    return res.status(422).end();
                }

                await db_returnOrder.updateReturnOrderIdOfSKUItem(element.SKUId, element.RFID, returnOrderID);
            }

            res.status(201).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    // DELETE /api/returnOrder/:id
    app.delete('/api/returnOrder/:id', [
        check('id').isNumeric()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const returnOrders = await db_returnOrder.getReturnOrderById(req.params['id']);
        if (returnOrders.length == 0) {
            res.status(404).json({ error: `No return order associated to id` });
            return;
        }

        try {
            await db_returnOrder.deleteReturnOrder(req.params['id']);
            // await db.deleteReturnOrder_SKU(req.params['id']);
            await db_returnOrder.deleteReturnOrder_SKUITEM(req.params['id']);
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of return order ${req.params.id}.` });
        }

    });

    //DELETE ALL
    app.delete('/api/deleteReturnOrders', async (req, res) => {
        try {
            await db_returnOrder.deleteAllReturnOrders();
            res.status(204).end();

        } catch (e) {
            res.status(500).end();
        }
    });
}