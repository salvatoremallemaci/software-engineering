const skuDAO = require('../modules/SKU/skuDAO');
const positionDAO = require('../modules/position/positionDAO');
const db_sku = new skuDAO('EzWh.db');
const db_position = new positionDAO('EzWh.db');

describe('testDao', () => {

    deleteAllSKUsTest();
    newSKUTest();
    getSKUbyIDTest();
    updateSKUTest();
    updateSKUwPosositionTest();
    deleteSKUTest();

});

function deleteAllSKUsTest() {
    test('delete db', async () => {
        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);
    });
}


function newSKUTest() {
    test('create new SKU', async () => {
        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);


        const data = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(data);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        res = await db_sku.getLastSKU();
        let sku = res[0];

        expect(sku.description).toStrictEqual(data.description);
        expect(sku.weight).toStrictEqual(data.weight);
        expect(sku.availableQuantity).toStrictEqual(data.availableQuantity);
        expect(sku.volume).toStrictEqual(data.volume);
        expect(sku.price).toStrictEqual(data.price);
        expect(sku.notes).toStrictEqual(data.notes);

    });
}

function getSKUbyIDTest() {
    test('get SKU by ID', async () => {

        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);


        const data = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(data);

        let skuID = 1;
        res = await db_sku.getSKUbyID(skuID);
        expect(res.length).toStrictEqual(1);

    });
}

function updateSKUTest() {
    test('update a SKU', async () => {
        
        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);


        const data = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(data);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        let idSKU = 1;

        const newData = {
            skuID: idSKU,
            newDescription: "new description of a SKU",
            newWeight: 15,
            newAvailableQuantity: 16,
            newVolume: 17,
            newPrice: 18.79,
            newNotes: "new notes of a SKU",
        };
        
        await db_sku.modifySku(newData);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);
        res = await db_sku.getSKUbyID(idSKU);
        expect(res.length).toStrictEqual(1);

        let sku = res[0];

        expect(sku.description).toStrictEqual(newData.newDescription);
        expect(sku.weight).toStrictEqual(newData.newWeight);
        expect(sku.availableQuantity).toStrictEqual(newData.newAvailableQuantity);
        expect(sku.volume).toStrictEqual(newData.newVolume);
        expect(sku.price).toStrictEqual(newData.newPrice);
        expect(sku.notes).toStrictEqual(newData.newNotes);

    });
}


function updateSKUwPosositionTest() {
    test('update a SKU with position', async () => {
        
        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        await db_position.deleteAllPositions();
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const data = {
            description: "description of a SKU",
            weight: 11,
            availableQuantity: 12,
            volume: 14,
            price: 10.79,
            notes: "notes of a SKU",
        };

        await db_sku.newSKU(data);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        const data_position ={
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col:  "3412",
            maxWeight: 1000,
            maxVolume:1000
        }

        db_position.insertPosition(data_position)
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);
        
        const data_SKU_position = {
            positionID: "800234543412",
            skuID: 1,
            newVolume: 150,
            newWeight: 160,
        };

        await db_sku.modifySkuPosition(data_SKU_position);

        
        res = await db_sku.getSKUbyID(1);
        let sku = res[0];

        expect(sku.position).toStrictEqual(data_SKU_position.positionID);

        const newData = {
            skuID: 1,
            newDescription: "new description of a SKU",
            newWeight: 15,
            newAvailableQuantity: 16,
            newVolume: 17,
            newPrice: 18.79,
            newNotes: "new notes of a SKU",
            position: "800234543412",
            volumeTOT : 17 * 16,
            weightTOT : 15 * 16
        };
        
        await db_sku.modifySku(newData);

        res = await db_sku.getSKUbyID(1);
        expect(res.length).toStrictEqual(1);
        sku = res[0];
        

        expect(sku.description).toStrictEqual(newData.newDescription);
        expect(sku.weight).toStrictEqual(newData.newWeight);
        expect(sku.availableQuantity).toStrictEqual(newData.newAvailableQuantity);
        expect(sku.volume).toStrictEqual(newData.newVolume);
        expect(sku.price).toStrictEqual(newData.newPrice);
        expect(sku.notes).toStrictEqual(newData.newNotes);
        expect(sku.position).toStrictEqual(data_SKU_position.positionID);

        res = await db_position.getPositionByID(sku.position);
        expect(res.length).toStrictEqual(1);

        let pos = res[0];
        
        expect(pos.occupiedWeight).toStrictEqual(newData.weightTOT);
        expect(pos.occupiedVolume).toStrictEqual(newData.volumeTOT);

    });
}

function deleteSKUTest(){
    test('delete SKU', async () => {

        await db_sku.deleteAllSKUs();
        let res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);

        await db_position.deleteAllPositions();
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const data = {
            description: "description of a SKU",
            weight: "11",
            availableQuantity: "12",
            volume: "14",
            price: "10.79",
            notes: "notes of a SKU",
            position: "800234543412",
        };

        await db_sku.newSKU(data);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(1);

        let idSKU = 1;

        const data_position ={
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col:  "3412",
            maxWeight: 1000,
            maxVolume:1000
        }


        db_position.insertPosition(data_position)
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);
        
        const data_SKU_position = {
            positionID: "800234543412",
            skuID: idSKU,
            newVolume: 150,
            newWeight: 160,
        };

        await db_sku.modifySkuPosition(data_SKU_position);

        await db_sku.deletePositionSKU(data.position, data.availableQuantity);
        rea = await db_position.getPositionByID(data.position);     
        expect(res.length).toStrictEqual(1);
        let pos = res[0];
        expect(pos.occupiedVolume).toStrictEqual(0);
        expect(pos.occupiedWeight).toStrictEqual(0);

        res = await db_sku.deleteSKU(idSKU);
        res = await db_sku.getStoredSKUS();
        expect(res.length).toStrictEqual(0);
    });
}

