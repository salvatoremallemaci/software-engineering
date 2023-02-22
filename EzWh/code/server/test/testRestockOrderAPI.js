const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const userFunctions  = require('./testUserAPI');
const SKUFunctions = require('./testSkuAPI');
const SKUItemFunctions = require('./testSKUItemAPI');
const positionFunctions = require('./testPositionAPI');
const itemFunctions = require('./testItemAPI');
const testResultFunctions = require('./testTestResultAPI');
const testDescriptorFunctions = require('./testTestDescriptorAPI');

describe('Creation of a restock order', () => {
    userFunctions.deleteAllUsersAPITest();
    SKUFunctions.deleteAllSKUAPITest();
    itemFunctions.deleteAllItemAPITest();
    deleteAllRestockOrdersAPITest();
    deleteAllRestockOrder_ItemAPITest();
    userFunctions.newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "supplier");
    SKUFunctions.newSKUAPITest(201, "prodotto 1", 100, 50, 50, 13, "nota 1");
    SKUFunctions.newSKUAPITest(201, "prodotto 2", 150, 30, 60, 23, "nota 2");
    itemFunctions.newItemAPITest(201, 10, "a new item", 10.99, 1, 1);
    itemFunctions.newItemAPITest(201, 18, "a new item", 10.99, 2, 1);
    newRestockOrderAPITest(201);
    getRestockOrdersAPITest(200, 1);
    getRestockOrdersIssuedAPITest(200, 1);
    getRestockOrderByIdAPITest(200, 1);
    getRestockOrderByIdAPITest(404, 2);
    deleteRestockOrderAPITest(204,1);
    getRestockOrdersAPITest(200, 0);
});


describe('Return item of Restock Order in state COMPLETEDRETURN', () => {
    SKUFunctions.deleteAllSKUAPITest();
    SKUItemFunctions.deleteAllSKUItemsTest();
    positionFunctions.deleteAllPositions();
    itemFunctions.deleteAllItemAPITest();
    deleteAllRestockOrdersAPITest();
    deleteAllRestockOrder_ItemAPITest();
    testDescriptorFunctions.deleteAllTestDescriptorTest();
    testResultFunctions.deleteAllTestResultAPITest();
    SKUFunctions.newSKUAPITest(201, "prodotto 1", 1, 50, 1, 13, "nota 1");
    SKUFunctions.newSKUAPITest(201, "prodotto 2", 1, 50, 1, 15, "nota 2");
    itemFunctions.newItemAPITest(201, 10, "a new item", 10.99, 1, 1);
    itemFunctions.newItemAPITest(201, 18, "a new item", 10.99, 2, 1);
    newRestockOrderAPITest(201);
    SKUItemFunctions.createSKUItem(201, "42345678901234567890123456789014", 1, "NULL");
    SKUItemFunctions.createSKUItem(201, "02345678901234567890123456789014", 2, "NULL");

    const data = {
        name: "test Descriptor for sku with id:1",
        procedureDescription: "this test is described",
        idSKU: 1
    }

    testDescriptorFunctions.newTestDescriptorPostTest(201, data );
    testResultFunctions.newTestResultAPITest(201,"42345678901234567890123456789014", 1, "2020/10/12", 0);
    // crea TEST RESULT CONNESSI A "42345678901234567890123456789014"
    
    positionFunctions.createPosition(201, "800270001002", "8002", "7000", "1002", 1000, 1000);
    SKUFunctions.updateSKUPositionAPITest(200, 1, "800270001002");
    
    updateStateOfRestockOrderAPITest(200, 1, "COMPLETEDRETURN");
    
    returnItemAPITest(200, 1); // verifica la lunghezza dell'array

});

describe('Add a transporte note to a restock order', () => {
    SKUFunctions.deleteAllSKUAPITest();
    itemFunctions.deleteAllItemAPITest();
    SKUItemFunctions.deleteAllSKUItemsTest();
    positionFunctions.deleteAllPositions();
    deleteAllRestockOrdersAPITest();
    deleteAllRestockOrder_ItemAPITest();

    SKUFunctions.newSKUAPITest(201, "prodotto 1", 1, 50, 1, 13, "nota 1");
    SKUFunctions.newSKUAPITest(201, "prodotto 2", 1, 50, 1, 15, "nota 2");
    itemFunctions.newItemAPITest(201, 10, "a new item", 10.99, 1, 1);
    itemFunctions.newItemAPITest(201, 18, "a new item", 10.99, 2, 1);
    newRestockOrderAPITest(201);
    SKUItemFunctions.createSKUItem(201, "42345678901234567890123456789014", 1, "NULL");
    SKUItemFunctions.createSKUItem(201, "02345678901234567890123456789014", 2, "NULL");
    
    positionFunctions.createPosition(201, "800270001002", "8002", "7000", "1002", 1000, 1000);
    SKUFunctions.updateSKUPositionAPITest(200, 1, "800270001002");
    
    updateStateOfRestockOrderAPITest(200, 1, "DELIVERY");
    modifyNoteAPITest(200, 1, "2021/12/29");
    modifyNoteAPITest(422, 1, "1940/12/29");
    updateStateOfRestockOrderAPITest(200, 1, "COMPLETED");
    modifyNoteAPITest(422, 1, "2021/12/29");
}); 

describe('Add a list of skuitems to a restock order', () => {
    SKUFunctions.deleteAllSKUAPITest();
    itemFunctions.deleteAllItemAPITest();
    SKUItemFunctions.deleteAllSKUItemsTest();
    positionFunctions.deleteAllPositions();
    deleteAllRestockOrdersAPITest();
    deleteAllRestockOrder_ItemAPITest();

    SKUFunctions.newSKUAPITest(201, "prodotto 1", 1, 50, 1, 13, "nota 1");
    SKUFunctions.newSKUAPITest(201, "prodotto 2", 1, 50, 1, 15, "nota 2");
    
    SKUItemFunctions.createSKUItem(201, "42345678901234567890123456789014", 1, "NULL");
    SKUItemFunctions.createSKUItem(201, "02345678901234567890123456789014", 2, "NULL");
    
    itemFunctions.newItemAPITest(201, 10, "a new item", 10.99, 1, 1);
    itemFunctions.newItemAPITest(201, 18, "a new item", 10.99, 2, 1);

    newRestockOrderAPITest(201);
    
    positionFunctions.createPosition(201, "800270001002", "8002", "7000", "1002", 1000, 1000);
    SKUFunctions.updateSKUPositionAPITest(200, 1, "800270001002");

    positionFunctions.createPosition(201, "800270001012", "8002", "7000", "1012", 1000, 1000);
    SKUFunctions.updateSKUPositionAPITest(200, 2, "800270001012");
    
    updateStateOfRestockOrderAPITest(200, 1, "COMPLETED");
    addSKUItemOfRestockOrderAPITest(422, 1);
    addSKUItemOfRestockOrderAPITest(404, 3);
    updateStateOfRestockOrderAPITest(200, 1, "DELIVERED");
    addSKUItemOfRestockOrderAPITest(200, 1);

}); 





function deleteRestockOrderAPITest(expectedHTTPStatus, restockOrderId){
    it('delete a restock order by id', function (done) {
        const url = '/api/restockOrder/' + restockOrderId;
        agent.delete(url)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteAllRestockOrdersAPITest() {
    it('clean db for restock order APIs', function (done) {

        agent.delete('/api/restockOrders/allRestockOrders')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function deleteAllRestockOrder_ItemAPITest() {
    it('clean db for restock order APIs', function (done) {

        agent.delete('/api/restockOrder_Item/allRestockOrder_Item')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}


function newRestockOrderAPITest(expectedHTTPStatus) {
    it('new restock order', function (done) {
        
        const order =
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":1, "itemId":10,"description":"prodotto 1","price":13.99,"qty":2},
                        {"SKUId":2,"itemId":18,"description":"prodotto 2","price":23.99,"qty":3}],
            "supplierId" : 1
        }
        
        agent.post('/api/restockOrder')
            .send(order)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getRestockOrdersAPITest(expectedHTTPStatus, expectedLength){
    it('getting restock orders from the system', function (done) {
        
        agent.get('/api/restockOrders')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            });
    });
}

function getRestockOrdersIssuedAPITest(expectedHTTPStatus, expectedLength){
    it('getting restock orders in state ISSUED from the system', function (done) {
        
        agent.get('/api/restockOrdersIssued')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            }).catch(done);
    });
}


function getRestockOrderByIdAPITest(expectedHTTPStatus, restockOrderId){
    it('getting restock orders by id', function (done) {
        const url = '/api/restockOrders/' + restockOrderId
        agent.get(url)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

// verifica la lunghezza dell'array
function returnItemAPITest(expectedHTTPStatus, restockOrderId){
    it('return item of restock order', function (done) {
        const url = '/api/restockOrders/' + restockOrderId + '/returnItems'
        agent.get(url)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function updateStateOfRestockOrderAPITest(expectedHTTPStatus, restockOrderId, newStateOfRestockOrder){
    it('update state of a restock order', function (done) {
        const url = '/api/restockOrder/' + restockOrderId;
        const state = {
            "newState": newStateOfRestockOrder
        }

        agent.put(url)
            .send(state)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function modifyNoteAPITest(expectedHTTPStatus, restockOrderId, date){
    it('modify transport note of a restock order', function (done) {
        const url = '/api/restockOrder/' + restockOrderId + '/transportNote';
        const note =
        {
            "transportNote": { "deliveryDate": date }
        }

        agent.put(url)
            .send(note)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function addSKUItemOfRestockOrderAPITest(expectedHTTPStatus, restockOrderId){
    it('add a list of sku item to a restock order', function (done) {
        const url = '/api/restockOrder/' + restockOrderId + '/skuItems';

        const SKUitem =
        {
            "skuItems" : [{"SKUId":1, "itemId":10, "rfid":"42345678901234567890123456789014"},{"SKUId":2, "itemId":18, "rfid":"02345678901234567890123456789014"}]
        }

        agent.put(url)
            .send(SKUitem)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}


module.exports={newRestockOrderAPITest,deleteAllRestockOrdersAPITest,deleteAllRestockOrder_ItemAPITest};



