const skuItemDAO = require('../modules/SKUItem/skuItemDAO');
const testDescriptorDAO = require('../modules/testDescriptor/testDescriptorDAO');
const db_skuItem = new skuItemDAO('EzWh.db');
const db_testDescriptor = new testDescriptorDAO('EzWh.db');

describe('testDao', () => {

    deleteAllTestDescriptorTest();
    newTestDescriptorTest();
    getTestDescriptorbyIDTest();
    updateTestDescriptorTest();
    deleteTestDescriptorTest();

});


function deleteAllTestDescriptorTest() {
    test('delete db', async () => {
        await db_testDescriptor.deleteAllTestDescriptor();
        let res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });
}

function newTestDescriptorTest() {
    test('create new Test Descriptor', async () => {
        
        await db_testDescriptor.deleteAllTestDescriptor();
        let res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        const testDescriptor =   {
            name:"test descriptor 3",
            procedureDescription:"This test is described by...",
            idSKU :1
        }

        await db_testDescriptor.newTestDescriptor(testDescriptor);

        res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        let testDes = res[0];
        expect(testDes.name).toStrictEqual(testDescriptor.name);
        expect(testDes.procedureDescription).toStrictEqual(testDescriptor.procedureDescription);
        expect(testDes.idSKU).toStrictEqual(testDescriptor.idSKU);

    });
}

function getTestDescriptorbyIDTest() {
    test('get Test Descriptor', async () => {

        await db_testDescriptor.deleteAllTestDescriptor();
        let res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        const testDescriptor =   {
            name:"test descriptor 3",
            procedureDescription:"This test is described by...",
            idSKU :1
        }

        await db_testDescriptor.newTestDescriptor(testDescriptor);

        res = await db_testDescriptor.getTestDescriptorByID(1);
        expect(res.length).toStrictEqual(1);
    });
}


function updateTestDescriptorTest() {
    test('modify a Test Descriptor', async () => {
      
        await db_testDescriptor.deleteAllTestDescriptor();
        let res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        const testDescriptor =   {
            name:"test descriptor 3",
            procedureDescription:"This test is described by...",
            idSKU :1
        }

        await db_testDescriptor.newTestDescriptor(testDescriptor);

        res = await db_testDescriptor.getTestDescriptorByID(1);
        expect(res.length).toStrictEqual(1);
    
         const newTestDescriptor =  {
            id:1,
            newName:"test descriptor 1",
            newProcedureDescription:"This test is described by...",
            newIdSKU :1
        }


        await db_testDescriptor.modifyTestDescriptor(newTestDescriptor);


        res = await db_testDescriptor.getTestDescriptorByID(1);
        expect(res.length).toStrictEqual(1);

        let testDes = res[0];
        expect(testDes.name).toStrictEqual(newTestDescriptor.newName);
        expect(testDes.procedureDescription).toStrictEqual(newTestDescriptor.newProcedureDescription);
        expect(testDes.idSKU).toStrictEqual(newTestDescriptor.newIdSKU);
    });

}


function deleteTestDescriptorTest() {
    test('delete a Test Descriptor', async () => {
            
        await db_testDescriptor.deleteAllTestDescriptor();
        let res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        const testDescriptor =   {
            name:"test descriptor 3",
            procedureDescription:"This test is described by...",
            idSKU :1
        }

        await db_testDescriptor.newTestDescriptor(testDescriptor);

        res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        await db_testDescriptor.deleteTestDescriptor(1);

        res = await db_testDescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(0);


    });
}