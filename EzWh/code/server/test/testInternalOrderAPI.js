const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
var skuFunction = require('./testSkuAPI');
var skuItemFunction = require('./testSKUItemAPI');
var positionFunction = require('./testPositionAPI');


describe('test INTERNAL ORDER API -> creazione nuovo internal Order', () => {
    skuFunction.deleteAllSKUAPITest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    newInternalOrderPostTest(201, "17/05/1996", products, 1);


});

describe('test INTERNAL ORDER API -> get internal Order', () => {
    skuFunction.deleteAllSKUAPITest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    getInternalOrdersAPITest(200);




});

describe('test INTERNAL ORDER API -> change State of Internal Order', () => {
    skuFunction.deleteAllSKUAPITest();
    skuItemFunction.deleteAllSKUItemsTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    skuItemFunction.createSKUItem(201, "12345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "22345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "32345678901234567890123456789014", 2, "2021/11/29");
    skuItemFunction.createSKUItem(201, "42345678901234567890123456789014", 2, "2021/11/29");


    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    const prod = [
        {
            SkuID: 1,
            RFID: "12345678901234567890123456789014"
        },
        {
            SkuID: 1,
            RFID: "22345678901234567890123456789014"
        }

    ]
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    getInternalOrdersAPITest(200);
    changeStateOfInternalOrderTest(200, 1, "ACCEPTED", prod);
    changeStateOfInternalOrderTest(200, 2, "COMPLETED", prod);





});


describe('test INTERNAL ORDER API -> get Internal Order in State ISSUED', () => {
    skuFunction.deleteAllSKUAPITest();
    skuItemFunction.deleteAllSKUItemsTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    skuItemFunction.createSKUItem(201, "12345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "22345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "32345678901234567890123456789014", 2, "2021/11/29");
    skuItemFunction.createSKUItem(201, "42345678901234567890123456789014", 2, "2021/11/29");


    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    const prod = [
        {
            SkuID: 1,
            RFID: "12345678901234567890123456789014"
        },
        {
            SkuID: 1,
            RFID: "22345678901234567890123456789014"
        }

    ]
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    getInternalOrdersAPITest(200);
    changeStateOfInternalOrderTest(200, 1, "ACCEPTED", prod);
    changeStateOfInternalOrderTest(200, 2, "COMPLETED", prod);
    getInternalOrdersISSUEDAPITest(200);




});

describe('test INTERNAL ORDER API -> get Internal Order in State ACCEPTED', () => {
    skuFunction.deleteAllSKUAPITest();
    skuItemFunction.deleteAllSKUItemsTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    skuItemFunction.createSKUItem(201, "12345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "22345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "32345678901234567890123456789014", 2, "2021/11/29");
    skuItemFunction.createSKUItem(201, "42345678901234567890123456789014", 2, "2021/11/29");


    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    const prod = [
        {
            SkuID: 1,
            RFID: "12345678901234567890123456789014"
        },
        {
            SkuID: 1,
            RFID: "22345678901234567890123456789014"
        }

    ]
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    getInternalOrdersAPITest(200);
    changeStateOfInternalOrderTest(200, 1, "ACCEPTED", prod);
    changeStateOfInternalOrderTest(200, 2, "COMPLETED", prod);
    getInternalOrdersACCEPTEDAPITest(200);




});
describe('test INTERNAL ORDER API -> get Internal Order by Id', () => {
    skuFunction.deleteAllSKUAPITest();
    skuItemFunction.deleteAllSKUItemsTest();
    skuFunction.newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    skuFunction.newSKUAPITest(201, "description of a SKU", 12, 11, 14, 15, "sku notes");
    skuItemFunction.createSKUItem(201, "12345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "22345678901234567890123456789014", 1, "2021/11/29");
    skuItemFunction.createSKUItem(201, "32345678901234567890123456789014", 2, "2021/11/29");
    skuItemFunction.createSKUItem(201, "42345678901234567890123456789014", 2, "2021/11/29");


    deleteAllInternalOrdersTest();
    deleteAllInternalOrdersSKUTest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    positionFunction.createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    skuFunction.updateSKUPositionAPITest(200, 1, "800234543411");
    skuFunction.updateSKUPositionAPITest(200, 2, "800234543412");
    const products = [
        {
            description: "description of a SKU",
            weight: 10,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 1
        },
        {
            description: "description of a SKU",
            weight: 12,
            qty: 2,
            volume: 14,
            price: 15.90,
            notes: "skunotes",
            SKUId: 2
        }
    ];
    const prod = [
        {
            SkuID: 1,
            RFID: "12345678901234567890123456789014"
        },
        {
            SkuID: 1,
            RFID: "22345678901234567890123456789014"
        }

    ]
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    newInternalOrderPostTest(201, "17/05/1996", products, 1);
    getInternalOrdersByIdAPITest(200, 1);




});


// describe('test INTERNAL ORDER APIs', () => {
//     skuFunction.deleteAllSKUAPITest();
//     skuFunction.newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15.90, "sku notes1");



// })


function newInternalOrderPostTest(expectedHTTPStatus, issueDate, products, customerId) {
    it('create a new Internal Order in state = ISSUED', function (done) {
        let obj = {
            issueDate: issueDate,
            products: products,
            customerId: customerId
        }
        agent.post('/api/internalOrders')
            .send(obj)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getInternalOrdersAPITest(expectedHTTPStatus) {
    it('get all internal orders', function (done) {
        agent.get('/api/internalOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getInternalOrdersISSUEDAPITest(expectedHTTPStatus) {
    it('get all internal orders in state ISSUED', function (done) {
        agent.get('/api/internalOrdersIssued')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getInternalOrdersACCEPTEDAPITest(expectedHTTPStatus) {
    it('get all internal orders in state ACCEPTED', function (done) {
        agent.get('/api/internalOrdersAccepted')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function getInternalOrdersByIdAPITest(expectedHTTPStatus, id) {
    it('get all internal orders in state ACCEPTED', function (done) {
        agent.get('/api/internalOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}



function deleteAllInternalOrdersTest() {
    it('delete delete all InternalOrder', function (done) {
        agent.delete('/api/deleteAllInternalOrders')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function deleteAllInternalOrdersSKUTest() {
    it('delete all InternalOrder_SKU', function (done) {
        agent.delete('/api/deleteAllInternalOrdersSKU')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function changeStateOfInternalOrderTest(expectedHTTPStatus, id, newState, products) {
    it('change state of internal order', function (done) {
        const obj = {
            newState: newState,
            products: products
        }
        agent.put('/api/internalOrders/' + id)
            .send(obj)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}