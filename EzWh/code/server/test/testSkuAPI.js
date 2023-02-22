const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
var positionFunction = require('./testPositionAPI');

describe('Multiple creation of SKU', () => {
    deleteAllSKUAPITest();
    newSKUAPITest(201, "description of a SKU", 10, 11, 14, 15, "sku notes");
    newSKUAPITest(422, "description of a SKU", "NaN", 11, 14, 15, "sku notes");
    newSKUAPITest(422, "description of a SKU", 10, "NaN", 14, 15, "sku notes");
    newSKUAPITest(422, "description of a SKU", 10, 11, "NaN", 15, "sku notes");
    newSKUAPITest(422, "description of a SKU", 10, 11, 14, "NaN", "sku notes");
    newSKUAPITest(422, "description of a SKU", 10, 11, 14, 15, "");
    newSKUAPITest(422, "", 10, 11, 14, 15, "sku notes");
})

describe('Get SKUs', () => {
    deleteAllSKUAPITest();
    newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    newSKUAPITest(201, "description of a SKU2", 10, 13, 17, 14, "sku notes2");
    newSKUAPITest(201, "description of a SKU3", 11, 14, 20, 35, "sku notes3");
    getSKUsAPITest(200, 3);
})

describe('Get SKU by ID', () => {
    deleteAllSKUAPITest();
    newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    getSKUbyIDAPITest(200, 1, 1);
})

describe('Update SKU', () => {
    deleteAllSKUAPITest();
    newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    const SKU = {
        newDescription: "new description of a SKU1",
        newWeight: 11,
        newAvailableQuantity: 12,
        newVolume: 15,
        newPrice: 16,
        newNotes: "new sku notes1"
    };
    updateSKUAPITest(200, 1, SKU);
})

describe('Update SKU position', () => {
    deleteAllSKUAPITest();
    positionFunction.deleteAllPositions();
    positionFunction.createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    updateSKUPositionAPITest(200, 1, "800234543411");
})

describe('Deletion of SKU', () => {
    deleteAllSKUAPITest();
    newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    deleteSKUAPITest(204, 1);
})

function getSKUsAPITest(expectedHTTPStatus, expectedLength) {
    it('getting SKU from the system', function (done) {

        agent.get('/api/skus')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            });
    });
}

function getSKUbyIDAPITest(expectedHTTPStatus, expectedLength, id) {
    it('getting SKU by id from the system', function (done) {

        agent.get('/api/skus/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            });
    });
}


function newSKUAPITest(expectedHTTPStatus, description, weight, availableQuantity, volume, price, notes) {
    it('new SKU', function (done) {
        const SKU = {
            description: description,
            weight: weight,
            availableQuantity: availableQuantity,
            volume: volume,
            price: price,
            notes: notes,
        };

        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function updateSKUAPITest(expectedHTTPStatus, id, newSKU) {
    it('update SKU in the system', function (done) {

        agent.put('/api/sku/' + id)
            .send(newSKU)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function updateSKUPositionAPITest(expectedHTTPStatus, skuID, positionID) {
    it('update SKU in the system', function (done) {

        const data = {
            position: positionID
        }
        agent.put('/api/sku/' + skuID + '/position')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteSKUAPITest(expectedHTTPStatus, idSKU) {
    it('delete a SKU', function (done) {
        const url = '/api/skus/' + idSKU;
        agent.delete(url)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteAllSKUAPITest() {
    it('clean db for sku APIs', function (done) {

        agent.delete('/api/sku/deleteAll')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

module.exports = {
    newSKUAPITest,
    deleteAllSKUAPITest,
    updateSKUPositionAPITest
}