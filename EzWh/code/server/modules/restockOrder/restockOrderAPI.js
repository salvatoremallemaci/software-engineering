
const itemDAO = require('../item/itemDAO');
const restockOrderDAO = require('./restockOrderDAO');
const skuItemDAO = require('../SKUItem/skuItemDAO');
const skuDAO = require('../SKU/skuDAO');
const positionDAO = require('../position/positionDAO');

const db_item = new itemDAO('EzWh.db');
const db_restockOrder = new restockOrderDAO('EzWh.db');
const db_SKUItem = new skuItemDAO('EzWh.db');
const db_SKU = new skuDAO('EzWh.db');
const db_position = new positionDAO('EzWh.db');

const { check, param, body, validationResult } = require('express-validator'); // validation middleware

module.exports.useApi = function useApi(app) {

    /* RESTOCK ORDER */

    //GET  /api/restockOrders
    app.get('/api/restockOrders', async (req, res) => {
        try {
            const order = await db_restockOrder.getRestockOrders();
            //console.log(order);
            const array = await db_restockOrder.getProducts();
            //console.log(array);
            order.forEach((element) => {
                element.products = array.filter((T) => T.restockOrder === element.id).map((t) => {
                    return new Object({
                        SKUId: t.SKUId,
                        itemId: t.itemId,
                        description: t.description,
                        price: t.price,
                        qty: t.qty
                    });
                });
                if (element.state === "ISSUED") {
                    delete element.transportNote;
                }
            });
            let skuItems;
            for (const ord of order) {
                //console.log(ord.id);
                skuItems = await db_restockOrder.getSKUItemsForOrder(ord.id);
                ord.skuItems = skuItems;
                if (ord.state === "DELIVERY" || ord.state === "ISSUED") {
                    ord.skuItems = [];
                }
            }
            res.status(200).json(order).end();
        } catch (e) {
            res.status(503).end();
        }
    });

    //GET /api/restockOrdersIssued
    app.get('/api/restockOrdersIssued', async (req, res) => {
        try {
            const order = await db_restockOrder.getRestockOrdersIssued();
            //console.log(order);
            const array = await db_restockOrder.getProducts();
            //console.log(array);
            order.forEach(element => {
                element.products = array.filter((T) => T.restockOrder === element.id).map((t) => {
                    return new Object({
                        SKUId: t.SKUId,
                        itemId: t.itemId,
                        description: t.description,
                        price: t.price,
                        qty: t.qty
                    });
                });
                element.skuItems = [];
            });
            res.status(200).json(order).end();
        } catch (e) {
            res.status(503).end();
        }
    });

    //GET api/restockOrders/:id
    app.get('/api/restockOrders/:id', [param('id').isInt()], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const order = await db_restockOrder.getRestockOrder(req.params.id);
            console.log(order);
            if (order.length == 0) {
                return res.status(404).end();
            }
            const array = await db_restockOrder.getProducts();
            order[0].products = array.filter((T) => T.restockOrder === order[0].id).map((t) => {
                return new Object({
                    SKUId: t.SKUId,
                    itemId: t.itemId,
                    description: t.description,
                    price: t.price,
                    qty: t.qty
                });
            });
            let skuItems;
            for (const ord of order) {
                console.log(ord.id);
                skuItems = await db_restockOrder.getSKUItemsForOrder(ord.id);
                let item;
                for(skuIt of skuItems){
                    item = db_item.getItemBySKUID(skuIt.SKUId);
                    skuItems.itemId = item[0];
                }
                ord.skuItems = skuItems;
                if (ord.state === "DELIVERY" || ord.state === "ISSUED") {
                    ord.skuItems = [];
                }
            }
            res.status(200).json(order).end();
        } catch (e) {
            res.status(503).end();
        }
    });

    //GET /api/restockOrders/:id/returnItems
    app.get('/api/restockOrders/:id/returnItems', [param('id').isInt()], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const order = await db_restockOrder.getRestockOrder(req.params.id);
            if (order.length == 0) {
                return res.status(404).end();
            }
            if (order[0].state != "COMPLETEDRETURN") {
                return res.status(404).end();
            }
            /* if (order[0].state == "ISSUED" || order[0].state == "DELIVERY") {
                const empty = [];
                return res.status(200).json(empty).end();
            } */

            const result = await db_restockOrder.returnItem(req.params.id);
            res.status(200).json(result).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    //POST /api/restockOrder
    app.post('/api/restockOrder', [
        check('issueDate').isString(),
        check('supplierId').isInt({ min: 0 })

    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const order = {
            issueDate: req.body.issueDate,
            products: req.body.products,
            supplierId: req.body.supplierId
        };

        try {
            await db_restockOrder.createRestockOrder(order);
            const id = await db_restockOrder.lastOrder();
            //console.log(`last Restock Order ID: ${id}`);
            let item;
            
            item = await db_item.getItemBySUPPLIERID(order.supplierId);
            if (item.length === 0) {
                return res.status(422).end();
            }

            for (const element of req.body.products) {
                item = await db_item.getItemBySKUID(element.SKUId);
                if (item.length === 0) {
                    return res.status(422).end();
                }

                //await db_item.createItemOfRestockOrder(element, element.itemId, order.supplierId);
                await db_restockOrder.newRestockOrder_Item(id, element.itemId, element.qty);
 

            }
            return res.status(201).end();
        } catch (err) {
            console.log(err);
            res.status(503).json({ error: "Database error during the creation of item" });
        }
    });

    //PUT  /api/restockOrder/:id
    app.put('/api/restockOrder/:id', [param('id').isInt(), check('newState').isString()], async (req, res) => {

        const state =
        {
            newState: req.body.newState
        }

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            let result = await db_restockOrder.getRestockOrder(req.params.id);
            if (result.length == 0) {
                return res.status(404).json();
            }
            await db_restockOrder.modifyStateRestockOrder(state, req.params.id);
            if (state.newState == "COMPLETEDRETURN"){
                let skus = await db_restockOrder.getSKUForRestockOrder(req.params.id);
            // data.newDescription, data.newWeight, data.newAvailableQuantity, data.newVolume, data.newPrice, data.newNotes, data.skuID
            for (element of skus) {
                let sku = await db_SKU.getSKUbyID(element.SKUId);
                let data = {
                    "newDescription": sku[0].description,
                    "newWeight": sku[0].weight,
                    "newAvailableQuantity": sku[0].availableQuantity - element.quantity,
                    "newVolume": sku[0].volume,
                    "newPrice": sku[0].price,
                    "newNotes": sku[0].notes,
                    "skuID": sku[0].id
                }

                if (sku[0].position !== null) {
                    const position = await db_position.getPositionByID(sku[0].position);
                    data.position = position[0].positionID;
                    data.volumeTOT = data.newVolume * data.newAvailableQuantity;
                    data.weightTOT = data.newWeight * data.newAvailableQuantity;
                }
                await db_SKU.modifySku(data);
            }
            
            let SKUItemsForRestockOrder = await db_restockOrder.getSKUItemsForOrder(req.params.id);
            console.log(SKUItemsForRestockOrder);
            for (e of SKUItemsForRestockOrder){
                await db_restockOrder.updateSKUITEM_available(e.rfid, req.params.id, 0);
            }

            }

            res.status(200).end();
        } catch (e) {
            res.status(503).end();
        }
    });

    //PUT /api/restockOrder/:id/skuItems
    app.put('/api/restockOrder/:id/skuItems', [param('id').isInt(), check('skuItems').isArray().isLength({min:1})], async (req, res) => {
        const array = {
            skuItems: req.body.skuItems
        }
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const exist = await db_restockOrder.getRestockOrder(req.params.id);
            if (exist.length == 0) {
                return res.status(404).json();
            }
            if (exist[0].state != "DELIVERED") {
                return res.status(422).json({ error: "Order not in DELIVERED state " });
            }

            for (e of array.skuItems) {

                let data = {
                    "SKUId": e.SKUId,
                    "itemId": e.itemId,
                    "RFID": e.rfid,
                    "dateOfStock": null
                }

                let temp = await db_SKUItem.getSKUItems();
                temp.filter((t)=>t.RFID===data.RFID)
                if(temp.length===0){
                    return res.status(422).end();
                }

                temp = await db_item.getItemBySKUID(data.SKUId);
                if(temp[0].id !== data.itemId){
                    return res.status(422).end();
                }

                //await db_SKUItem.newSKUItem(data);
                await db_restockOrder.updateSKUITEM_available(data.RFID, req.params.id, 1);
                // avaiability of sku += quantity of sku

            }

            let skus = await db_restockOrder.getSKUForRestockOrder(req.params.id);

            for (element of skus) {
                let sku = await db_SKU.getSKUbyID(element.SKUId);
                console.log(sku);
                let data = {
                    "newDescription": sku[0].description,
                    "newWeight": sku[0].weight,
                    "newAvailableQuantity": sku[0].availableQuantity + element.quantity,
                    "newVolume": sku[0].volume,
                    "newPrice": sku[0].price,
                    "newNotes": sku[0].notes,
                    "skuID": sku[0].id
                }

                if (sku[0].position !== null) {
                    const position = await db_position.getPositionByID(sku[0].position);
                    data.position = position[0].positionID;
                    data.volumeTOT = data.newVolume * data.newAvailableQuantity;
                    data.weightTOT = data.newWeight * data.newAvailableQuantity;
                }
                console.log(data);
                await db_SKU.modifySku(data);
            }

            res.status(200).end();
        } catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });

    //PUT /api/restockOrder/:id/transportNote
    app.put('/api/restockOrder/:id/transportNote', [param('id').isInt()], async (req, res) => {

        const note =
        {
            transportNote: req.body.transportNote
        }

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            if (typeof note.transportNote !== 'object') {
                return res.status(422).json("L'input deve essere un oggetto");
            }

            const result = await db_restockOrder.getRestockOrder(req.params.id);
            if (result.length == 0) {
                return res.status(404).json();
            }

            if (result[0].state != "DELIVERY" || req.body.transportNote.deliveryDate < result[0].issueDate ){
                return res.status(422).json("order not in DELIVERY state or deliveryDate < issueDate");
            }

            await db_restockOrder.modifyNote(note, req.params.id);
            res.status(200).end();
        } catch (e) {
            res.status(503).end();
        }
    });

    //DELETE  /api/restockOrder/:id
    app.delete('/api/restockOrder/:id', [param('id').isInt()], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const result = await db_restockOrder.deleteRestockOrder(req.params.id);
            await db_restockOrder.deleteRestockOrder_Item(req.params.id);
            /* if (result) {
              await deleteRestockOrder_SKUItem(req.params.id);
            } */
            res.status(204).end();;
        } catch (e) {
            res.status(503).end();
        }
    });

    // DELETE /api/restockOrders/allRestockOrders
    app.delete('/api/restockOrders/allRestockOrders', async (req, res) => {
        try {
            await db_restockOrder.deleteAllRestockOrders();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of all restock orders.` });
        }

    });

    // DELETE /api/restockOrders/allRestockOrders
    app.delete('/api/restockOrder_Item/allRestockOrder_Item', async (req, res) => {
        try {
            await db_restockOrder.deleteAllRestockOrder_Item();
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of restockorder_item.` });
        }

    });


}