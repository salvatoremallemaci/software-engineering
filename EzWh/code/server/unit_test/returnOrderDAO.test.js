const returnOrderDAO = require('../modules/returnOrder/returnOrderDAO');
const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const SKU = require('../modules/SKU/skuDAO');
const itemDAO = require('../modules/item/itemDAO');
const db_returnOrder = new returnOrderDAO('EzWh.db');
const db_skuItem= new skuItemDAO('EzWh.db');
const db_sku= new SKU('EzWh.db');
const db_item= new itemDAO('EzWh.db');
describe('returnOrderDAO test', () => {

    deleteAllReturnOrderTest();
    createReturnOrder();
});

function deleteAllReturnOrderTest() {
    test('delete db', async () => {
        await db_returnOrder.deleteAllReturnOrders();
        let res = await db_returnOrder.getReturnOrders();
        expect(res.length).toStrictEqual(0);
    });
}

function createReturnOrder() {
    test('create a return order', async () => {
        await db_returnOrder.deleteAllReturnOrders();
        let res = await db_returnOrder.getReturnOrders();
        expect(res.length).toStrictEqual(0);
        await db_skuItem.deleteAllSKUItems();
        await db_sku.deleteAllSKUs();

        const sku={
            description:"a product1", 
            weight:12,
            availableQuantity:1,
            volume:12,
            price:13,
            notes:"qualcosa"
        }
        await db_sku.newSKU(sku);

        //create skuItem
        const skuItem1={
            RFID:"12345678901234567890123456789016",
            SKUId:1,
            DateOfStock:"2021/10/11"
        }
        const skuItem2={
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/10/12"
        }

        const item1={
            id:10,
            description:"desc",
            price:10,
            supplierId: 1,
            SKUId:1,
        }

        await db_skuItem.newSKUItem(skuItem1);
        await db_skuItem.newSKUItem(skuItem2);
        await db_item.createItem(item1);

        const data = {
            "returnDate": "2021/11/29 09:33",
            "products": [{ "SKUId": 1, "itemId":10, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
            { "SKUId": 1, "itemId":10, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789015" }],
            "restockOrderId": 1
        };
        await db_returnOrder.newReturnOrder(data);
        let returnOrders = await db_returnOrder.getReturnOrders();
        expect(returnOrders.length).toStrictEqual(1);

        returnOrders = await db_returnOrder.getReturnOrderById(1);
        expect(returnOrders.length).toStrictEqual(1);

        const returnOrderID = await db_returnOrder.getLastIdOfReturnOrders();
        // console.log(returnOrderID);
        for (const element of data.products) {
            await db_returnOrder.updateReturnOrderIdOfSKUItem(element.SKUId, element.RFID, returnOrderID);
        }
        const returnOrder = await db_returnOrder.getReturnOrderById(returnOrderID);
        res = returnOrder[0];
        
        expect(res.returnDate).toStrictEqual(data.returnDate);
        expect(res.restockOrderId).toStrictEqual(data.restockOrderId);
        
        res = await db_returnOrder.getProductsOfReturnOrder();
        const result= res.filter((skuItem)=>{return skuItem.returnOrderId==returnOrderID})
        for (let i = 0; i < data.products.length; i++) {
            expect(result[i].RFID).toStrictEqual(data.products[i].RFID);
        }

        await db_returnOrder.deleteReturnOrder(1);
        returnOrders = await db_returnOrder.getReturnOrders();
        expect(returnOrders.length).toStrictEqual(0);
        await db_returnOrder.deleteReturnOrder_SKUITEM(1);
        res = await db_returnOrder.getProductsOfReturnOrder();
        expect(returnOrders.length).toStrictEqual(0);
    });
}

