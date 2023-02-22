const skuDAO = require('../modules/SKU/skuDAO');
const itemDAO = require('../modules/item/itemDAO');
const restockOrderDAO = require('../modules/restockOrder/restockOrderDAO');
const userDAO = require('../modules/user/userDAO');
const db_user = new userDAO('EzWh.db');
const db_restockOrder = new restockOrderDAO('EzWh.db');
const db_sku = new skuDAO('EzWh.db');
const db_item = new itemDAO('EzWh.db');

describe('testDao', () => {

    deleteAllItemsTest();
    newItemTest();
    getItembySKUIDTest();
    updateItemTest();
    deleteItemTest();

});


function deleteAllItemsTest() {
    test('delete db', async () => {
        await db_item.deleteAllItems();
        let res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);
    });
}

function newItemTest() {
    test('create new Item', async () => {
        await db_item.deleteAllItems();
        let res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_sku.deleteAllSKUs();
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(sku);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        let skuID = 1;

        await db_user.deleteAllUsers();
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        const item = {
            id: 1,
            description: "description of an Item",
            price: 11.50,
            SKUId: skuID,
            supplierId: 1
        };

        await db_item.createItem(item);

        res = await db_item.getLastIdOfItem();
        let it = res[0];
        expect(it.id).toStrictEqual(item.id);
        expect(it.description).toStrictEqual(item.description);
        expect(it.price).toStrictEqual(item.price);
        expect(it.SKUId).toStrictEqual(item.SKUId);
        expect(it.supplierId).toStrictEqual(item.supplierId);

        //Test of NO previous order with same supplierID

        await db_restockOrder.deleteAllRestockOrders();
        await db_restockOrder.deleteAllRestockOrder_Item();

        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);

        const order = {
            issueDate: "2021-02-11",
            supplierId: 1
        };

        await db_restockOrder.createRestockOrder(order);
        res = await db_restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);


        await db_restockOrder.newRestockOrder_Item(1, item.id, 1);

        res = await db_item.getSupplierforSkuIdOrId(1, item.id, item.SKUId);
        expect(res.length).toStrictEqual(1);

    });
}

function getItembySKUIDTest() {
    test('get item', async () => {
        await db_item.deleteAllItems();
        let res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_sku.deleteAllSKUs();
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(sku);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        let skuID = 1;

        await db_user.deleteAllUsers();
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        const item = {
            id: 1,
            description: "description of an Item",
            price: 11.50,
            SKUId: skuID,
            supplierId: 1
        };

        await db_item.createItem(item);

        res = await db_item.getItemBySKUID(skuID);
        expect(res.length).toStrictEqual(1);
    });
}


function updateItemTest() {
    test('modify an Item', async () => {
        await db_item.deleteAllItems();
        let res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_sku.deleteAllSKUs();
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(sku);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

       
        let skuID = 1

        await db_user.deleteAllUsers();
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        const item = {
            id: 1,
            description: "description of an Item",
            price: 11.50,
            SKUId: skuID,
            supplierId: 1
        };

        await db_item.createItem(item);

        res = await db_item.getItems();
        expect(res.length).toStrictEqual(1);

        const newItem = {
            newDescription: "new description of an Item",
            newPrice: 14.50,
        };

        await db_item.modifyItem(newItem, item.id, item.supplierId);
        //GABRIELE
        res =  await db_item.getItem(item.id, item.supplierId);
        expect(res.length).toStrictEqual(1);
        let it = res[0];
        
/*
        res =  await db_item.getItems();
        expect(res.length).toStrictEqual(1);
        let it = res[0];
*/
        expect(it.description).toStrictEqual(newItem.newDescription);
        expect(it.price).toStrictEqual(newItem.newPrice);

    });
}


function deleteItemTest() {
    test('delete an Item', async () => {
        await db_item.deleteAllItems();
        let res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);

        await db_sku.deleteAllSKUs();
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(sku);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        let skuID = 1;

        await db_user.deleteAllUsers();
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        const item = {
            id: 1,
            description: "description of an Item",
            price: 11.50,
            SKUId: skuID,
            supplierId: 1
        };

        await db_item.createItem(item);
        res = await db_item.getItems();
        expect(res.length).toStrictEqual(1);

        await db_item.deleteItem(item.id, item.supplierId);
        res = await db_item.getItems();
        expect(res.length).toStrictEqual(0);


    });
}