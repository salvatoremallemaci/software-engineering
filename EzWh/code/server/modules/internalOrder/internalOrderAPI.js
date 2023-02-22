
const internalOrderDAO = require('./internalOrderDAO');
const db_internalOrder = new internalOrderDAO('EzWh.db');
const { check, validationResult } = require('express-validator'); // validation middleware

module.exports.useApi = function useApi(app) {

    /* INTERNAL ORDER */

    // GET /api/internalOrders
    app.get('/api/internalOrders', async (req, res) => {
        try {
            const internalOrders = await db_internalOrder.getInternalOrders();
            const testArrayCompleted = await db_internalOrder.getProductsOfInternalOrderCompleted();
            const testArray = await db_internalOrder.getProductsOfInternalOrder();

            internalOrders.forEach(element => {
                if (element.state == "COMPLETED") {
                    element.products = testArrayCompleted.filter((T) => T.internalOrderId === element.id)
                        .map(
                            (T) => T
                        )
                } else {
                    element.products = testArray.filter((T) => T.internalOrderId === element.id)
                        .map(
                            (T) => T
                        )
                }
            });


            for (const element of internalOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].internalOrderId;
                }
            }

            res.status(200).json(internalOrders);
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    // GET /api/internalOrdersIssued
    app.get('/api/internalOrdersIssued', async (req, res) => {
        try {
            const internalOrders = await db_internalOrder.getInternalOrdersByState("ISSUED");
            const testArray = await db_internalOrder.getProductsOfInternalOrder();
            internalOrders.forEach(element => {
                element.products = testArray
                    .filter((T) => T.internalOrderId === element.id)
                    .map(
                        (T) => T
                    )
            });

            for (const element of internalOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].internalOrderId;
                }
            }

            res.status(200).json(internalOrders);
        } catch (e) {
            res.status(500).end();
        }
    });

    // GET /api/internalOrdersAccepted
    app.get('/api/internalOrdersAccepted', async (req, res) => {
        try {
            const internalOrders = await db_internalOrder.getInternalOrdersByState("ACCEPTED");
            const testArray = await db_internalOrder.getProductsOfInternalOrder();
            internalOrders.forEach(element => {
                element.products = testArray
                    .filter((T) => T.internalOrderId === element.id)
                    .map(
                        (T) => T
                    )
            });

            for (const element of internalOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].internalOrderId;
                }
            }

            res.status(200).json(internalOrders);
        } catch (e) {
            res.status(500).end();
        }
    });

    // GET /api/internalOrders/:id
    app.get('/api/internalOrders/:id', [
        check('id').isNumeric()
    ], async (req, res) => {
        try {
            const internalOrders = await db_internalOrder.getInternalOrderById(req.params['id']);
            if (internalOrders.length == 0) {
                res.status(404).json({ error: `No internal order associated to id` });
                return;
            }
            const testArrayCompleted = await db_internalOrder.getProductsOfInternalOrderCompleted();
            const testArray = await db_internalOrder.getProductsOfInternalOrder();

            internalOrders.forEach(element => {
                if (element.state == "COMPLETED") {
                    element.products = testArrayCompleted.filter((T) => T.internalOrderId === element.id)
                        .map(
                            (T) => T
                        )
                } else {
                    element.products = testArray.filter((T) => T.internalOrderId === element.id)
                        .map(
                            (T) => T
                        )
                }
            });


            for (const element of internalOrders) {
                for (let i = 0; i < element.products.length; i++) {
                    delete element.products[i].internalOrderId;
                }
            }

            res.status(200).json(internalOrders[0]);
        } catch (e) {
            res.status(500).end();
        }
    });

    // POST /api/internalOrders
    app.post('/api/internalOrders', [
        check('issueDate').isString(),
        check('products').not().isEmpty(),
        check('customerId').isNumeric()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const internalOrder = {
            "issueDate": req.body.issueDate,
            "products": req.body.products,
            "customerId": req.body.customerId
        };



        try {
            // verifica della quantità
            /*
            for (const element of req.body.products) {
                let quantityOfSKU = await db_internalOrder.checkAvaiabilityOfSKUForInternalOrder(element.SKUId);
                if (element.qty >= quantityOfSKU) {
                    console.log("ERRORE");
                    res.status(400).json({ error: `Not enough quantity of SKU: ${element.SKUId}.` });
                    return;
                }
            }
            */
            // creazione dell'internal order
            await db_internalOrder.newInternalOrder(internalOrder);
            const internalOrderId = await db_internalOrder.getLastIdOfInternalOrders();

            for (const element of req.body.products) {
                /*
                // aggiornamento associazione internal order - sku
                await db_internalOrder.newInternalOrder_SKU(internalOrderId, element.SKUId, element.qty);
                // decrementa quantità in magazzino
                await db_internalOrder.decreaseQuantityOfSKUForInternalOrder(element.SKUId, element.qty);
                // aggiornamento position 
                // mi prendo positionid

                const positionId = await db_internalOrder.getPositionIdBySKUId(element.SKUId);

                await db_internalOrder.decreasePositionInternalOrder(positionId, element.qty);
                */
            }

            res.status(201).end();
        } catch (e) {
            res.status(500).end();
        }
    });

    // PUT /api/internalOrders/:id
    app.put('/api/internalOrders/:id', [
        check('id').isNumeric(),
        check('newState').isString()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const internalOrders = await db_internalOrder.getInternalOrderById(req.params['id']);
        if (internalOrders.length == 0) {
            res.status(404).json({ error: `No internal order associated to id` });
            return;
        }

        try {

            await db_internalOrder.updateInternalOrder(req.params['id'], req.body.newState);
            if (req.body.newState == "REFUSED" || req.body.newState == "CANCELLED") {
                // prendo gli SKU associati agli internal orders
                const array = await db_internalOrder.getProductsOfInternalOrder();
                // prendo gli SKU associati all'internal order corrente
                const testArray = array.filter((T) => T.internalOrderId == req.params['id']);
                for (const element of testArray) {
                    await db_internalOrder.increaseQuantityOfSKUForInternalOrder(element.SKUId, element.qty);
                    // aggiornamento position ??? RIMANDO A QUANDO UNIAMO I FILE
                    const positionId = await db_internalOrder.getPositionIdBySKUId(element.SKUId);
                    console.log(positionId);
                    await db_internalOrder.increasePositionInternalOrder(positionId, element.qty);
                }
            }

            if (req.body.newState == "COMPLETED") {
                const productsOfInternalOrder = req.body.products;
                for (const element of productsOfInternalOrder) {
                    await db_internalOrder.updateInternalOrderIdOfSKUItem(element.SkuID, element.RFID, req.params['id']);
                }
            }

            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the update of internal order ${req.params.id}.` });
        }

    });


    // DELETE /api/internalOrders/:id
    app.delete('/api/internalOrders/:id', [
        check('id').isNumeric()
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const internalOrders = await db_internalOrder.getInternalOrderById(req.params['id']);
        if (internalOrders.length == 0) {
            res.status(404).json({ error: `No internal order associated to id` });
            return;
        }

        try {
            await db_internalOrder.deleteInternalOrder(req.params['id']);
            await db_internalOrder.deleteInternalOrder_SKU(req.params['id']);
            await db_internalOrder.deleteInternalOrder_SKUITEM(req.params['id']);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of internal order ${req.params.id}.` });
        }

    });


    app.delete('/api/deleteAllInternalOrders', async (req, res) => {
        try {
            await db_internalOrder.deleteAllInternalOrders();
            res.status(204).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.delete('/api/deleteAllInternalOrdersSKU', async (req, res) => {
        try {
            await db_internalOrder.deleteAllInternalOrders_SKU();
            res.status(204).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

}