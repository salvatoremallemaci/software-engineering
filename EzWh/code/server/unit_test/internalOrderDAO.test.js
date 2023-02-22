const internalOrderDAO = require('../modules/internalOrder/internalOrderDAO');
const skuDAO = require('../modules/SKU/skuDAO');
const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const positionDAO = require('../modules/position/positionDAO');
const db_position = new positionDAO('EzWh.db');
const db_internalOrder = new internalOrderDAO('EzWh.db');
const db_SKU = new skuDAO('EzWh.db');
const db_SKUITEM = new skuItemDAO('EzWh.db');

describe('test InternalOrderDao', () => {
    getInternalOrdersTest();
    getInternalOrderByIdTest();
    getInternalOrderByStateTest();
    getProductsOfInternalOrderTest();
    checkAvaiabilityOfSKUForInternalOrderTest();
    getLastIdOfInternalOrdersTest();
    decreaseQuantityOfSKUForInternalOrderTest();
    increaseQuantityOfSKUForInternalOrderTest();
    getPositionIdBySKUIdTest();
    updateInternalOrderIdOfSKUItemTest();
    getProductsOfInternalOrderCompletedTest();
    deleteInternalOrderTest();
    newInternalOrder_SKUTest();
    deleteInternalOrder_SKUByIdTest();
    decreasePositionInternalOrderTest();
    increasePositionInternalOrderTest();
    updateInternalOrderTest();
    deleteInternalOrder_SKUTest();
    deleteInternalOrder_SKUITEMTest();

});




function getInternalOrdersTest() {
    test('get all the internal orders', async () => {
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }
        const internalOrder2 = {
            issueDate: "01-01-20",
            customerId: 5
        }
        const internalOrder3 = {
            issueDate: "01-01-20",
            customerId: 4
        }

        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder(internalOrder2);
        await db_internalOrder.newInternalOrder(internalOrder3);

        res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(3);

        expect(res[0].customerId).toStrictEqual(internalOrder1.customerId);

    });
}

function getInternalOrderByIdTest() {
    test('get internal order by id', async () => {
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }
        const internalOrder2 = {
            issueDate: "01-01-20",
            customerId: 5
        }
        const internalOrder3 = {
            issueDate: "01-01-20",
            customerId: 4
        }

        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder(internalOrder2);
        await db_internalOrder.newInternalOrder(internalOrder3);

        res = await db_internalOrder.getInternalOrderById(1);

        expect(res.length).toStrictEqual(1);

        expect(res[0].customerId).toStrictEqual(internalOrder1.customerId);

    });
}


function getInternalOrderByStateTest() {
    test('get internal order by state', async () => {
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }
        const internalOrder2 = {
            issueDate: "01-01-20",
            customerId: 5
        }
        const internalOrder3 = {
            issueDate: "01-01-20",
            customerId: 4
        }

        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder(internalOrder2);
        await db_internalOrder.newInternalOrder(internalOrder3);

        res = await db_internalOrder.getInternalOrdersByState("ISSUED");

        expect(res.length).toStrictEqual(3);

        expect(res[0].customerId).toStrictEqual(internalOrder1.customerId);

    });
}



function getProductsOfInternalOrderTest() {
    test('get products of internal order', async () => {
        await db_SKU.deleteAllSKUs();
        await db_internalOrder.deleteAllInternalOrders();
        await db_internalOrder.deleteAllInternalOrders_SKU();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }

        const sku = {
            description: "sku",
            weight: 20,
            availableQuantity: 20,
            volume: 20,
            price: 10,
            notes: 20
        }
        await db_SKU.newSKU(sku);

        res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        await db_internalOrder.newInternalOrder(internalOrder1);

        await db_internalOrder.newInternalOrder_SKU(1, 1, 20);

        res = await db_internalOrder.getProductsOfInternalOrder();

        expect(res.length).toStrictEqual(1);



    });
}

function getProductsOfInternalOrderCompletedTest() {
    test('get internal orders completed', async () => {
        await db_internalOrder.deleteAllInternalOrders();
        await db_internalOrder.deleteAllInternalOrders_SKU();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }

        await db_internalOrder.newInternalOrder(internalOrder1);


        await db_SKUITEM.deleteSKUItem("22345678901234567890123456789015");
        const skuitem = {
            RFID: "22345678901234567890123456789015",
            SKUId: 1,
            dateOfStock: "2021/11/29 12:30",
        }
        await db_SKUITEM.newSKUItem(skuitem);
        await db_internalOrder.updateSkuItemForInternalOrder("22345678901234567890123456789015", 1);



        await db_internalOrder.newInternalOrder_SKU(1, 1, 20);


        res = await db_internalOrder.getProductsOfInternalOrderCompleted();

        expect(res.length).toStrictEqual(1);

    });
}

function checkAvaiabilityOfSKUForInternalOrderTest() {
    test('check availability of sku item for internal order', async () => {
        await db_SKU.deleteAllSKUs();
        let res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "sku",
            weight: 200,
            availableQuantity: 200,
            volume: 200,
            price: 10,
            notes: 20
        }
        await db_SKU.newSKU(sku);



        res = await db_internalOrder.checkAvaiabilityOfSKUForInternalOrder(1);

        expect(res).toStrictEqual(sku.availableQuantity);

    });
}

function getLastIdOfInternalOrdersTest() {
    test('get Last id of internal order', async () => {
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }

        await db_internalOrder.newInternalOrder(internalOrder1);


        res = await db_internalOrder.getLastIdOfInternalOrders();

        expect(res).toStrictEqual(1);

    });
}

function decreaseQuantityOfSKUForInternalOrderTest() {
    test('decrease available quantity of as sku', async () => {
        await db_SKU.deleteAllSKUs();
        let res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "sku",
            weight: 200,
            availableQuantity: 200,
            volume: 200,
            price: 10,
            notes: 20
        }
        const decrement = 10;
        await db_SKU.newSKU(sku);
        res = await db_internalOrder.decreaseQuantityOfSKUForInternalOrder(1, decrement);

        expect(res).toStrictEqual(1);

    });
}

function increaseQuantityOfSKUForInternalOrderTest() {
    test('increase available quantity of as sku', async () => {
        await db_SKU.deleteAllSKUs();
        let res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "sku",
            weight: 200,
            availableQuantity: 200,
            volume: 200,
            price: 10,
            notes: 20
        }
        const decrement = 10;
        await db_SKU.newSKU(sku);
        res = await db_internalOrder.increaseQuantityOfSKUForInternalOrder(1, decrement);

        expect(res).toStrictEqual(1);

    });
}

function getPositionIdBySKUIdTest() {
    test('increase available quantity of as sku', async () => {

        await db_SKU.deleteAllSKUs();
        await db_position.deleteAllPositions();
        let res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(0);
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const sku = {
            description: "sku",
            weight: 20,
            availableQuantity: 20,
            volume: 20,
            price: 10,
            notes: 20
        }
        const sku2 = {
            skuID: 1,
            positionID: "800234543412",
            newVolume: 21,
            newWeight: 12
        }

        const data_position = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        await db_position.insertPosition(data_position)
        await db_SKU.newSKU(sku);
        await db_SKU.modifySkuPosition(sku2);

        res = await db_SKU.getStoredSKUS();
        expect(res.length).toStrictEqual(1);
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);

        res = await db_internalOrder.getPositionIdBySKUId(1);
        let position = res;
        expect(position).toStrictEqual("800234543412");

    });
}

function updateInternalOrderIdOfSKUItemTest() {

    test('increase available quantity of as sku', async () => {
        await db_internalOrder.deleteAllSkuItem();

        const skuitem = {
            RFID: "22345678901234567890123456789015",
            SKUId: 1,
            dateOfStock: "2021/11/29 12:30",
        }

        await db_SKUITEM.newSKUItem(skuitem);

        res = await db_internalOrder.updateInternalOrderIdOfSKUItem(1, "22345678901234567890123456789015", 1);

        expect(res).toStrictEqual(1);

    });


}
function deleteInternalOrderTest() {
    test('increase available quantity of as sku', async () => {

        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }
        const internalOrder2 = {
            issueDate: "01-01-20",
            customerId: 5
        }
        const internalOrder3 = {
            issueDate: "01-01-20",
            customerId: 4
        }

        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder(internalOrder2);
        await db_internalOrder.newInternalOrder(internalOrder3);

        await db_internalOrder.deleteInternalOrder(1);
        res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(2);
    });
}

function newInternalOrder_SKUTest() {
    test('increase available quantity of as sku', async () => {
        await db_internalOrder.deleteAllInternalOrders_SKU();
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);


        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }


        await db_internalOrder.newInternalOrder(internalOrder1);
        res = await db_internalOrder.newInternalOrder_SKU(1, 1, 10);
        expect(res).toStrictEqual(1);
    });
}

function deleteInternalOrder_SKUByIdTest() {
    test('delete all internalOrder_SKU', async () => {
        await db_internalOrder.deleteAllInternalOrders_SKU();
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);


        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }


        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder_SKU(1, 1, 10);
        await db_internalOrder.deleteAllInternalOrders_SKU(1);
        res = await db_internalOrder.getInternalOrders_SKU();
        expect(res.length).toStrictEqual(0);
    });
}

function decreasePositionInternalOrderTest() {
    test('decreasePositionInternalOrderTest', async () => {
        await db_internalOrder.deleteAllInternalOrders_SKU();
        await db_internalOrder.deleteAllInternalOrders();
        await db_position.deleteAllPositions();
        const data_position = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        await db_position.insertPosition(data_position)
        const sku = {
            description: "sku",
            weight: 20,
            availableQuantity: 20,
            volume: 20,
            price: 10,
            notes: 20
        }
        await db_SKU.newSKU(sku);
        const sku2 = {
            skuID: 1,
            positionID: "800234543412",
            newVolume: 21,
            newWeight: 12
        };

        await db_SKU.modifySkuPosition(sku2);


        let res = await db_internalOrder.decreasePositionInternalOrder("800234543412", 1);
        expect(res).toStrictEqual(1);
    });
}

function increasePositionInternalOrderTest() {
    test('increasePositionInternalOrderTest', async () => {
        await db_internalOrder.deleteAllInternalOrders_SKU();
        await db_internalOrder.deleteAllInternalOrders();
        await db_position.deleteAllPositions();
        const data_position = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        await db_position.insertPosition(data_position)
        const sku = {
            description: "sku",
            weight: 20,
            availableQuantity: 20,
            volume: 20,
            price: 10,
            notes: 20
        }
        await db_SKU.newSKU(sku);
        const sku2 = {
            skuID: 1,
            positionID: "800234543412",
            newVolume: 21,
            newWeight: 12
        };

        await db_SKU.modifySkuPosition(sku2);


        let res = await db_internalOrder.increasePositionInternalOrder("800234543412", 1);
        expect(res).toStrictEqual(1);
    });
}

function updateInternalOrderTest() {
    test('increasePositionInternalOrderTest', async () => {

        await db_internalOrder.deleteAllInternalOrders();

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }
        const internalOrder2 = {
            issueDate: "01-01-20",
            customerId: 5
        }
        const internalOrder3 = {
            issueDate: "01-01-20",
            customerId: 4
        }

        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder(internalOrder2);
        await db_internalOrder.newInternalOrder(internalOrder3);


        let res = await db_internalOrder.updateInternalOrder(1, "ACCEPTED");
        expect(res).toStrictEqual(1);
    });
}

function deleteInternalOrder_SKUTest() {
    test('increasePositionInternalOrderTest', async () => {

        await db_internalOrder.deleteAllInternalOrders_SKU();
        await db_internalOrder.deleteAllInternalOrders();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);


        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }


        await db_internalOrder.newInternalOrder(internalOrder1);
        await db_internalOrder.newInternalOrder_SKU(1, 1, 10);
        await db_internalOrder.deleteInternalOrder_SKU(1);
        res = await db_internalOrder.getInternalOrders_SKU();
        expect(res.length).toStrictEqual(0);
    });
}

function deleteInternalOrder_SKUITEMTest() {
    test('increasePositionInternalOrderTest', async () => {

        await db_internalOrder.deleteAllInternalOrders();
        await db_internalOrder.deleteAllInternalOrders_SKU();
        let res = await db_internalOrder.getInternalOrders();
        expect(res.length).toStrictEqual(0);

        const internalOrder1 = {
            issueDate: "01-01-20",
            customerId: 3
        }

        await db_internalOrder.newInternalOrder(internalOrder1);


        await db_SKUITEM.deleteSKUItem("22345678901234567890123456789015");
        const skuitem = {
            RFID: "22345678901234567890123456789015",
            SKUId: 1,
            dateOfStock: "2021/11/29 12:30",
        }
        await db_SKUITEM.newSKUItem(skuitem);
        await db_internalOrder.updateSkuItemForInternalOrder("22345678901234567890123456789015", 1);



        await db_internalOrder.newInternalOrder_SKU(1, 1, 20);

        await db_internalOrder.deleteInternalOrder_SKUITEM(1);
        res = await db_internalOrder.getInternalOrders_SKU();
        expect(res.length).toStrictEqual(1);
    });
}
