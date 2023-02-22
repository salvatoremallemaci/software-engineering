const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const userDAO = require('../modules/SKUItem/skuItemDAO');
const db_skuItem = new userDAO('EzWh.db');

describe('skuItemDAO creation test', () => {

    deleteAllSkuItemTest();
    insertSkuItem();
    getSKUItemsTest();
    getSKUItemsBySKUIDTest()
    getSKUItemsByRFIDTest()
    deleteSkuItemTest();
});

describe('skuItemDAO modify test', () => {

    deleteAllSkuItemTest();
    modifyRFID();
});

function deleteAllSkuItemTest() {
    test('delete db', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);
    });
}

function insertSkuItem() {
    test('creation skuItem', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);

        const data =
        {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        await db_skuItem.newSKUItem(data);
        res = await db_skuItem.getSKUItemsByRFID(data.RFID);
        const skuItem = res[0];

        expect(skuItem.RFID).toStrictEqual(data.RFID);
        expect(skuItem.SKUId).toStrictEqual(data.SKUId);
        expect(skuItem.DateOfStock).toStrictEqual(data.DateOfStock);

    });
}

function modifyRFID() {
    test('modify rfid of a skuItem', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);
        const oldData =
        {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };
        await db_skuItem.newSKUItem(oldData);
        const data = {
            "newRFID": "12345678901234567890123456789016",
            "newAvailable": 1,
            "newDateOfStock": "2021/11/29 12:30",
            "rfid": "12345678901234567890123456789015"
        };

        await db_skuItem.modifySkuItem(data);
        res = await db_skuItem.getSKUItemsByRFID(data.newRFID);
        // console.log(res[0]);
        const skuItem = res[0];

        expect(skuItem.RFID).toStrictEqual(data.newRFID);
        expect(skuItem.Available).toStrictEqual(data.newAvailable);
        expect(skuItem.DateOfStock).toStrictEqual(data.newDateOfStock);
    });
}

function getSKUItemsTest() {
    test('get skuItems from db', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);

        const data1 =
        {
            RFID: "12345678901234567890123456789031",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        const data2 =
        {
            RFID: "12345678901234567890123456789030",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        await db_skuItem.newSKUItem(data1);
        await db_skuItem.newSKUItem(data2);
        res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(2);
    });
}

function getSKUItemsBySKUIDTest() {
    test('getting skuItems by its skuID from db', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);

        const data1 =
        {
            RFID: "12345678901234567890123456789031",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        const data2 =
        {
            RFID: "12345678901234567890123456789030",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };
        const newData1 =
        {
            newRFID: "12345678901234567890123456789031",
            newAvailable: 1,
            newDateOfStock: "2021/11/29",
            rfid: "12345678901234567890123456789031"
        };

        await db_skuItem.newSKUItem(data1);
        await db_skuItem.newSKUItem(data2);
        await db_skuItem.modifySkuItem(newData1);
        res = await db_skuItem.getSKUItemsBySKUID(data1.SKUId);
        expect(res.length).toStrictEqual(1);
    });
}

function getSKUItemsByRFIDTest() {
    test('getting skuItem by its RFID from db', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);

        const data1 =
        {
            RFID: "12345678901234567890123456789031",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        const data2 =
        {
            RFID: "12345678901234567890123456789030",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };
        const data3 =
        {
            RFID: "12345678901234567890123456789035",
            SKUId: 2,
            DateOfStock: "2021/11/29"
        };

        await db_skuItem.newSKUItem(data1);
        await db_skuItem.newSKUItem(data2);
        await db_skuItem.newSKUItem(data3);
        res = await db_skuItem.getSKUItemsByRFID(data1.RFID);
        expect(res[0].RFID).toStrictEqual(data1.RFID);
        expect(res[0].SKUId).toStrictEqual(data1.SKUId);
        expect(res[0].DateOfStock).toStrictEqual(data1.DateOfStock);
    });
}

function deleteSkuItemTest() {
    test('delete db', async () => {
        await db_skuItem.deleteAllSKUItems();
        let res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(0);

        const data1 =
        {
            RFID: "12345678901234567890123456789031",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };

        const data2 =
        {
            RFID: "12345678901234567890123456789030",
            SKUId: 1,
            DateOfStock: "2021/11/29"
        };
        const data3 =
        {
            RFID: "12345678901234567890123456789035",
            SKUId: 2,
            DateOfStock: "2021/11/29"
        };

        await db_skuItem.newSKUItem(data1);
        await db_skuItem.newSKUItem(data2);
        await db_skuItem.newSKUItem(data3);

        await db_skuItem.deleteSKUItem(data1.RFID);

        res = await db_skuItem.getSKUItems();
        expect(res.length).toStrictEqual(2);
    });
}