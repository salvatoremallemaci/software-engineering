const positionDAO = require('../modules/position/positionDAO');
const db_position = new positionDAO('EzWh.db');

describe('positionDAO creation test', () => {

    deleteAllPositionsTest();
    newPositionTest();
    getPositionsTest();
    getPositionByIDTest();
    updatePositionTest();
    deletePositionTest();
});

describe('positionDAO modify test', () => {

    deleteAllPositionsTest();
    modifyPosition();
});

function deleteAllPositionsTest() {
    test('delete db', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);
    });
}

function getPositionsTest() {
    test('get positions', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);
        
        const data = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        };

        await db_position.insertPosition(data);
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);
    });
}

function getPositionByIDTest() {
    test('get position by id', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);
        
        const data = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        };

        await db_position.insertPosition(data);
        res = await db_position.getPositionByID("800234543412");
        expect(res.length).toStrictEqual(1);
    });
}

function newPositionTest() {
    test('create new position', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);


        const data = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        };

        await db_position.insertPosition(data);
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);

        res = await db_position.getPositionByID(data.positionID);
        let position = res[0];

        expect(position.aisleID).toStrictEqual(data.aisleID);
        expect(position.row).toStrictEqual(data.row);
        expect(position.col).toStrictEqual(data.col);
        expect(position.maxWeight).toStrictEqual(data.maxWeight);
        expect(position.maxVolume).toStrictEqual(data.maxVolume);

    });
}

function updatePositionTest() {
    test('update position', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const oldData = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
        };

        await db_position.insertPosition(oldData);

        const newData = [ 
            "800234543445",
            "8002",
            "3454",
            "3445",
            "800234543412"
        ];

        await db_position.updatePosition(newData);
        newPosition= await db_position.getPositionByID(newData[0]);
        res=newPosition[0];
        expect(res.positionID).toStrictEqual(newData[0]);
        expect(res.aisleID).toStrictEqual(newData[1]);
        expect(res.row).toStrictEqual(newData[2]);
        expect(res.col).toStrictEqual(newData[3]);
    });
}


function modifyPosition() {
    test('modify position', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const oldData = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
        };

        await db_position.insertPosition(oldData);

        const newData = [ 
            "800234543412",
            "8002",
            "3454",
            "3412",
            1200,
            600,
            200,
            100,
            "800234543412"
        ];

        await db_position.modifyStorePosition(newData);
        newPosition= await db_position.getPositionByID(oldData.positionID);
        res=newPosition[0];
        expect(res.aisleID).toStrictEqual(newData[1]);
        expect(res.row).toStrictEqual(newData[2]);
        expect(res.col).toStrictEqual(newData[3]);
        expect(res.maxWeight).toStrictEqual(newData[4]);
        expect(res.maxVolume).toStrictEqual(newData[5]);
        expect(res.occupiedWeight).toStrictEqual(newData[6]);
        expect(res.occupiedVolume).toStrictEqual(newData[7]);

    });
}

function deletePositionTest() {
    test('delete a position in the db by its id', async () => {
        await db_position.deleteAllPositions();
        let res = await db_position.getPositions();
        expect(res.length).toStrictEqual(0);

        const data1 = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
        };

        const data2 = {
            positionID: "800234543430",
            aisleID: "8002",
            row: "3454",
            col: "3430",
            maxWeight: 1000,
            maxVolume: 1000,
        };

        await db_position.insertPosition(data1);
        await db_position.insertPosition(data2);
        await db_position.deletePosition(data1.positionID)
        res = await db_position.getPositions();
        expect(res.length).toStrictEqual(1);

    });
}