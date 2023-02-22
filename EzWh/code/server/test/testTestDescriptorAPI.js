const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
var skuFunction = require('./testSkuAPI');

describe('test TestDescriptor APIs -> create new test descriptor', () => {
    skuFunction.deleteAllSKUAPITest();
    deleteAllTestDescriptorTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    const data = {
        name: "test Descriptor 3",
        procedureDescription: "this test is described by..",
        idSKU: 1
    }
    newTestDescriptorPostTest(201, data);
});

describe('test testDescriptor APIs -> get all testDescriptor', () => {
    skuFunction.deleteAllSKUAPITest();
    deleteAllTestDescriptorTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    const data = {
        name: "test Descriptor 3",
        procedureDescription: "this test is described by..",
        idSKU: 1
    }
    newTestDescriptorPostTest(201, data);
    getTestDescriptorsTest(200);
});
describe('test testDescriptor APIs -> get all testDescriptor', () => {
    skuFunction.deleteAllSKUAPITest();
    deleteAllTestDescriptorTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    const data = {
        name: "test Descriptor 3",
        procedureDescription: "this test is described by..",
        idSKU: 1
    }
    newTestDescriptorPostTest(201, data);
    getTestDescriptorByIDTest(200, 1);
});

describe('test testDescriptor APIs -> update a testDescriptor', () => {
    skuFunction.deleteAllSKUAPITest();
    deleteAllTestDescriptorTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    const data = {
        name: "test Descriptor 3",
        procedureDescription: "this test is described by..",
        idSKU: 1
    }

    newTestDescriptorPostTest(201, data);
    updateTestDescriptorTest(200, 1);
});

describe('test testDescriptor APIs -> delete a testDescriptor given its id', () => {
    skuFunction.deleteAllSKUAPITest();
    deleteAllTestDescriptorTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    const data = {
        name: "test Descriptor 3",
        procedureDescription: "this test is described by..",
        idSKU: 1
    }

    newTestDescriptorPostTest(201, data);
    deleteTestDescriptorTestByID(204, 1);
});


function newTestDescriptorPostTest(expectedHTTPStatus, data) {
    it('create a new TestDescriptor', function (done) {
        let obj = {
            name: data.name,
            procedureDescription: data.procedureDescription,
            idSKU: data.idSKU
        }
        agent.post('/api/testDescriptor')
            .send(obj)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getTestDescriptorsTest(expectedHTTPStatus) {
    it('get all test Descriptor', function (done) {
        agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getTestDescriptorByIDTest(expectedHTTPStatus, id) {
    it('get test Descriptor by Id', function (done) {
        agent.get('/api/testDescriptors/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function deleteAllTestDescriptorTest() {
    it('delete all test Descriptor', function (done) {
        agent.delete('/api/deleteTestDescriptors')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function updateTestDescriptorTest(expectedHTTPStatus, id) {
    it('update Test Descriptor', function (done) {
        const obj = {
            id: id,
            newName: "test descriptor modified",
            newProcedureDescription: "new procedure description",
            newIdSKU: 1
        }
        agent.put('/api/testDescriptor/' + id)
            .send(obj)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteTestDescriptorTestByID(expectedHTTPStatus, id) {
    it('delete a testDescriptor given its id ', function (done) {
        agent.delete('/api/testDescriptor/' + id)
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

module.exports = {
    newTestDescriptorPostTest,
    deleteAllTestDescriptorTest
}