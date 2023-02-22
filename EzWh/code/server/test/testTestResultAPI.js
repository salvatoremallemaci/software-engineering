const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const SKUItemFunction = require('./testSKUItemAPI');
const SKUFunction = require('./testSkuAPI');
const testDescriptorFunction = require('./testTestDescriptorAPI');
var agent = chai.request.agent(app);

describe('Multiple creation of TestResult', () => {
    deleteAllTestResultAPITest();

    SKUFunction.deleteAllSKUAPITest();
    SKUFunction.newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
   
    SKUItemFunction.deleteAllSKUItemsTest();
    SKUItemFunction.createSKUItem(201, "12345678901234567890123456789016", 1, "2021/11/29");
    
    testDescriptorFunction.deleteAllTestDescriptorTest();
    let data = {
        name: "test name",
        procedureDescription:"procedure description",
        idSKU: 1
    }
    testDescriptorFunction.newTestDescriptorPostTest(201,data)


    
    newTestResultAPITest(201, "12345678901234567890123456789016", 1, "2021/11/28", true);
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", false);
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);

})

describe('Get TestResults', () => {
    deleteAllTestResultAPITest();
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", false);
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);
    getTestResultAPITest(200, 3, "12345678901234567890123456789016");
})

describe('Get TestResults by ID', () => {
    deleteAllTestResultAPITest();
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);
    getTestResultbyIDAPITest(200, 1, "12345678901234567890123456789016", 1);
})

describe('Update TestResults', () => {
    deleteAllTestResultAPITest();
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);
    const newTestDesc = {
        newIdTestDescriptor: 1,
        newDate: "2021/11/28",
        newResult: true
    }
    updateTestResultAPITest(200, "12345678901234567890123456789016", 1, newTestDesc);
})


describe('Deletion of Test Result', () => {
    deleteAllTestResultAPITest();
    newTestResultAPITest(201,"12345678901234567890123456789016", 1, "2021/11/28", true);
    deleteTestResultAPITest(204, "12345678901234567890123456789016", 1);
})

function getTestResultAPITest(expectedHTTPStatus, expectedLength, rfid) {
    it('getting SKU from the system', function (done) {

        agent.get('/api/skuitems/' + rfid + '/testResults/')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            }).catch(done);
    });
}

function getTestResultbyIDAPITest(expectedHTTPStatus, expectedLength, rfid, id) {
    it('getting TestResult by id from the system', function (done) {

        agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.have.equal(id);
                done();
            }).catch(done);
    });
}


function newTestResultAPITest(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result) {
    it('new Test Result', function (done) {
        const testDesc = {
            rfid: rfid,
            idTestDescriptor: idTestDescriptor,
            Date: Date,
            Result: Result
        }

        agent.post('/api/skuitems/testResult')
            .send(testDesc)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function updateTestResultAPITest(expectedHTTPStatus, rfid, id, newTestDesc) {
    it('update TestResult in the system', function (done) {

        agent.put('/api/skuitems/' + rfid + '/testResult/' + id)
            .send(newTestDesc)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}


function deleteTestResultAPITest(expectedHTTPStatus, rfid, id) {
    it('delete a Test Result', function (done) {
        const url = '/api/skuitems/' + rfid + '/testResult/' + id;
        agent.delete(url)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteAllTestResultAPITest() {
    it('clean db for TestResult', function (done) {

        agent.delete('/api/testResult/deleteAll')
            .then(function (res) {
                res.should.have.status(204);
                done();
            }).catch(done);
    });
}

module.exports = {
    newTestResultAPITest, deleteAllTestResultAPITest
}