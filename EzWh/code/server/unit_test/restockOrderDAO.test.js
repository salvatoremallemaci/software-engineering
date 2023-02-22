const restockOrderDAO = require('../modules/restockOrder/restockOrderDAO');
const db_restockOrder = new restockOrderDAO('EzWh.db');
const itemDAO = require('../modules/item/itemDAO');
const db_item = new itemDAO('EzWh.db');
const userDAO = require('../modules/user/userDAO');
const db_user = new userDAO('EzWh.db');
const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const db_SKUItem = new skuItemDAO('EzWh.db');
const testResultDAO = require('../modules/testResult/testResultDAO');
const db_testResult = new testResultDAO('EzWh.db');

describe('restockOrderDAO test', () => {

    deleteAllRestockOrdersTest();
    deleteRestockOrderTest();
    newRestockOrderTest();
    getRestockOrdersISSUED();
    getRestockOrderByIdTest();
    getProductsOfRestockOrderTest();
    getSKUItemsOfRestockOrderTest();
    returnItemTest();
    modifyNoteTest();
});


function deleteAllRestockOrdersTest() {
    test('delete db', async () => {
        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);
    });
}

function deleteRestockOrderTest(){
    test('delete db', async () => {
        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.deleteRestockOrder(1);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

    });
}


function newRestockOrderTest() {
    test('create new restock order', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();

        // INSERT INTO RESTOCKORDER(ISSUEDATE, STATE,ACCOUNTID) VALUES(?, ?, ?)

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const order2 = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        await db_restockOrder.createRestockOrder(order2);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(2);

    });
}


function getProductsOfRestockOrderTest() {
    test('get products of a restock order', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_restockOrder.deleteAllRestockOrder_Item();
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_item.deleteAllItems();
        res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }


        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        lastOrderId = await db_restockOrder.lastOrder();

        await db_item.createItemOfRestockOrder(order.products[0], item.id, order.supplierId);
        await db_restockOrder.newRestockOrder_Item(lastOrderId, item.id, order.products[0].qty);

        res = await db_restockOrder.getProducts();
        expect(res.length).toStrictEqual(1);

        res = await db_restockOrder.getSKUForRestockOrder(lastOrderId);
        expect(res.length).toStrictEqual(1);

    });
}

function getRestockOrderByIdTest() {
    test('get products of a restock order', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        lastOrderId = await db_restockOrder.lastOrder();

        res = await db_restockOrder.getRestockOrder(lastOrderId);
        expect(res.length).toStrictEqual(1);

    });

}

function getSKUItemsOfRestockOrderTest() {
    test('get SKU items of a restock order', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_restockOrder.deleteAllRestockOrder_Item();
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_item.deleteAllItems();
        res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();
        await db_SKUItem.deleteAllSKUItems();

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        const state =
        {
            "newState": "DELIVERED"
        }


        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        lastOrderId = await db_restockOrder.lastOrder();

        await db_item.createItemOfRestockOrder(order.products[0], item.id, order.supplierId);
        await db_restockOrder.newRestockOrder_Item(lastOrderId, item.id, order.products[0].qty);

        res = await db_restockOrder.getProducts();
        expect(res.length).toStrictEqual(1);
        await db_restockOrder.modifyStateRestockOrder(state, lastOrderId);

        const SKUItem =
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 1,
            Available: 0,
            DateOfStock: null
        };

        await db_SKUItem.newSKUItem(SKUItem);
        await db_restockOrder.updateSKUITEM_available(SKUItem.RFID, lastOrderId, 1);

        res = await db_restockOrder.getSKUItemsForOrder(lastOrderId);
        expect(res.length).toStrictEqual(1);

    });


}

function getRestockOrdersISSUED() {
    test('create new restock order', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();

        // INSERT INTO RESTOCKORDER(ISSUEDATE, STATE,ACCOUNTID) VALUES(?, ?, ?)

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const order2 = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const state =
        {
            "newState": "DELIVERED"
        }

        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        await db_restockOrder.createRestockOrder(order2);

        await db_restockOrder.modifyStateRestockOrder(state, 2);

        res = await db_restockOrder.getRestockOrdersIssued();
        expect(res.length).toStrictEqual(1);

    });
}

function returnItemTest() {
    test('return all items of an order that failed atleast one test ', async () => {
        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_restockOrder.deleteAllRestockOrder_Item();
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_item.deleteAllItems();
        res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();
        await db_SKUItem.deleteAllSKUItems();
        await db_testResult.deleteAllTestResult();

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        const state =
        {
            "newState": "COMPLETEDRETURN"
        }


        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        lastOrderId = await db_restockOrder.lastOrder();

        await db_item.createItemOfRestockOrder(order.products[0], item.id, order.supplierId);
        await db_restockOrder.newRestockOrder_Item(lastOrderId, item.id, order.products[0].qty);

        res = await db_restockOrder.getProducts();
        expect(res.length).toStrictEqual(1);
        await db_restockOrder.modifyStateRestockOrder(state, lastOrderId);

        const SKUItem =
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 1,
            Available: 0,
            DateOfStock: null
        };

        const testResult =
            [
                "2021/11/28",
                false,
                1,
                "12345678901234567890123456789014"
            ]
        await db_SKUItem.newSKUItem(SKUItem);
        await db_restockOrder.updateSKUITEM_available(SKUItem.RFID, lastOrderId, 1);

        await db_testResult.insertTestResult(testResult);

        res = await db_restockOrder.returnItem(lastOrderId);
        expect(res.length).toStrictEqual(1);
    });

}

function modifyNoteTest() {
    test('modify note', async () => {

        await db_restockOrder.deleteAllRestockOrders();
        let res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        await db_user.deleteAllUsers();

        // INSERT INTO RESTOCKORDER(ISSUEDATE, STATE,ACCOUNTID) VALUES(?, ?, ?)

        const order = {
            issueDate: "2021-02-11",
            products: [{ "SKUId": 20, "description": "a product", "price": 10.99, "qty": 30 }],
            supplierId: 1
        };

        const user = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const state =
        {
            "newState": "DELIVERY"
        }

        const note =
        {
            "transportNote" : { "deliveryDate": "2021/12/29" }
        }


        await db_user.newUser(user);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await db_restockOrder.createRestockOrder(order);

        await db_restockOrder.modifyStateRestockOrder(state, 1);

        await db_restockOrder.modifyNote(note, 1);
        res = await db_restockOrder.getRestockOrders();
        expect(res[0].transportNote.deliveryDate).toStrictEqual(note.transportNote.deliveryDate);

    });





}


