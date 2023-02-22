const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const testResultDAO = require('../modules/testResult/testResultDAO');
const db_skuItem = new skuItemDAO('EzWh.db');
const db_testResult = new testResultDAO('EzWh.db');

describe('testDao', () => {

    deleteAllTestResultTest();
    newTestResultTest();
    getTestResultbyIDTest();
    updateTestResultTest();
    deleteTestResultTest();

});


function deleteAllTestResultTest() {
    test('delete db', async () => {
        await db_testResult.deleteAllTestResult();
        let res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);
    });
}

function newTestResultTest() {
    test('create new Test Result', async () => {
        await db_testResult.deleteAllTestResult();
        let res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);

        const testResult = {
            rfid: "12345678901234567890123456789016",
            idTestDescriptor: 12,
            Date: "2021/11/28",
            Result: true
        };

        let data = ["2021/11/28", true, 12,  "12345678901234567890123456789016"];
        await db_testResult.insertTestResult(data);

        res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(1);
        let testRes = res[0];
        expect(testRes.idTestDescriptor).toStrictEqual(testResult.idTestDescriptor);
        expect(testRes.Date).toStrictEqual(testResult.Date);
        expect(testRes.Result).toStrictEqual(testResult.Result);
    });
}

function getTestResultbyIDTest() {
    test('get Test Result', async () => {

        await db_testResult.deleteAllTestResult();
        let res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);

        const testResult = {
            rfid: "12345678901234567890123456789016",
            idTestDescriptor: 12,
            Date: "2021/11/28",
            Result: true
        };

        let data = ["2021/11/28", true, 12,  "12345678901234567890123456789016"];
        await db_testResult.insertTestResult(data);


        data = ["12345678901234567890123456789016", 1];
        res = await db_testResult.getTestResult(data);
        expect(res.id).toStrictEqual(1);
    });
}


function updateTestResultTest() {
    test('modify a Test Result', async () => {
        await db_testResult.deleteAllTestResult();
        let res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);

        const testResult = {
            rfid: "12345678901234567890123456789016",
            idTestDescriptor: 12,
            Date: "2021/11/28",
            Result: true
        };

        let data = ["2021/11/28", true, 12,  "12345678901234567890123456789016"];
        await db_testResult.insertTestResult(data);


        data = ["12345678901234567890123456789016", 1];
        res = await db_testResult.getTestResult(data);
        expect(res.id).toStrictEqual(1);
    

        const newTestResult = ["2021/11/28", 12, false, 1, "12345678901234567890123456789016"];
        const newData = {
            newIdTestDescriptor: 12,
            newDate: "2021/11/28",
            newResult: false
        }

        await db_testResult.updateTestResult(newTestResult);

        res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(1);
        let testRes = res[0];
        expect(testRes.idTestDescriptor).toStrictEqual(newData.newIdTestDescriptor);
        expect(testRes.Date).toStrictEqual(newData.newDate);
        expect(testRes.Result).toStrictEqual(newData.newResult);

    });

}


function deleteTestResultTest() {
    test('delete a Test Result', async () => {
        await db_testResult.deleteAllTestResult();
        let res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);

        const testResult = {
            rfid: "12345678901234567890123456789016",
            idTestDescriptor: 12,
            Date: "2021/11/28",
            Result: true
        };

        let data = ["2021/11/28", true, 12,  "12345678901234567890123456789016"];
        await db_testResult.insertTestResult(data);


        res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(1);

        
        data = ["12345678901234567890123456789016", 1];
        await db_testResult.deleteTestResult(data);

        res = await db_testResult.getTestResults("12345678901234567890123456789016");
        expect(res.length).toStrictEqual(0);


    });
}