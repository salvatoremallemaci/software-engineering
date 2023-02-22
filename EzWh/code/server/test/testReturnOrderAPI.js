const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
const restockFunctions= require('./testRestockOrderAPI');
const itemFunctions = require ('./testItemAPI');
const SKUFunctions = require('./testSkuAPI');
const SKUItemFunctions = require('./testSKUItemAPI');

describe('test ReturnOrder APIs', () => {
    deleteAllReturnOrderTest();
    restockFunctions.deleteAllRestockOrdersAPITest();
    restockFunctions.deleteAllRestockOrder_ItemAPITest();
    restockFunctions.newRestockOrderAPITest(201);
    
    SKUFunctions.deleteAllSKUAPITest();
    itemFunctions.deleteAllItemAPITest();
    SKUItemFunctions.deleteAllSKUItemsTest();

    SKUFunctions.newSKUAPITest(201, "prodotto 1", 1, 50, 1, 13, "nota 1");
    SKUFunctions.newSKUAPITest(201, "prodotto 2", 1, 50, 1, 15, "nota 2");
    
    SKUItemFunctions.createSKUItem(201, "42345678901234567890123456789014", 1, "NULL");
    SKUItemFunctions.createSKUItem(201, "02345678901234567890123456789014", 2, "NULL");
    
    itemFunctions.newItemAPITest(201, 10, "a new item", 10.99, 1, 1);
    itemFunctions.newItemAPITest(201, 18, "a new item", 10.99, 2, 1);

    
    //CREATE A RESTOCK ORDER CON ID=1
    createReturnOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 1, "itemId":10, "description": "a product", "price": 10.99, "RFID": "42345678901234567890123456789014" },
        { "SKUId": 2, "itemId":18, "description": "another product", "price": 11.99, "RFID": "02345678901234567890123456789014" }],
        1)
    createReturnOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 1, "itemId":10, "description": "a product", "price": 10.99, "RFID": "42345678901234567890123456789014" },
        { "SKUId": 2, "itemId":18,  "description": "another product", "price": 11.99, "RFID": "02345678901234567890123456789014" }],
        1)
    createReturnOrder(422, 2021 / 11 / 29,
        [{ "SKUId": 1, "itemId":10, "description": "a product", "price": 10.99, "RFID": "42345678901234567890123456789014" },
        { "SKUId": 2, "itemId":18,  "description": "another product", "price": 11.99, "RFID": "02345678901234567890123456789014" }],
        1)
    createReturnOrder(404, "2021/11/29 09:33",
        [{ "SKUId": 1, "itemId":10,  "description": "a product", "price": 10.99, "RFID": "42345678901234567890123456789014" },
        { "SKUId": 2, "itemId":18,  "description": "another product", "price": 11.99, "RFID": "02345678901234567890123456789014" }],
        2);
    //Ricordati di aggiornare il valore della lunghezza
    getReturnOrders(200, 2);
    getReturnOrderById(200,1);
    deleteReturnOrder(204,1);
    getReturnOrderById(404,1);
    restockFunctions.deleteAllRestockOrdersAPITest();
    restockFunctions.deleteAllRestockOrder_ItemAPITest();
})

function deleteAllReturnOrderTest() {
    it('clean db for returnOrder APIs', function (done) {

        agent.delete('/api/deleteReturnOrders')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function getReturnOrders(expectedHTTPStatus, length) {
    it('getting return orders from the system', function (done) {
        agent.get('/api/returnOrders')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            })
            .catch(done);
    });
};

function getReturnOrderById(expectedHTTPStatus, id) {
    it('getting an order by its id from the system', function (done) {
        agent.get('/api/returnOrders/'+id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(done);
    });
};

function createReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId) {
    it('creating a returnOrder in the system', function (done) {
        let returnOrder = {
            returnDate: returnDate,
            products: products,
            restockOrderId: restockOrderId
        };
        agent.post('/api/returnOrder')
            .send(returnOrder)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(done);
    });
}

function deleteReturnOrder(expectedHTTPStatus, id) {
    it('delete a returnOrder given its id', function (done) {
        agent.delete('/api/returnOrder/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(done);
    });
}
