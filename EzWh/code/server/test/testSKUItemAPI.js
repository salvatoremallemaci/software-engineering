const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const SKUFunction = require('./testSkuAPI');
var agent = chai.request.agent(app);
//Manca la creazione degli SKU
describe('test SKUItem APIs', () => {

    deleteAllSKUItemsTest();
    SKUFunction.newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    createSKUItem(201, "12345678901234567890123456789014", 1, "2021/11/29");
    createSKUItem(201, "22345678901234567890123456789014", 1, "2021/11/29");
    createSKUItem(404, "12345678901234567890123456789014", 50, "2021/11/29");
    createSKUItem(422, "1", 1, 2021 / 11 / 29);
    updateSKUItem(200, "12345678901234567890123456789014", "12345678901234567890123456789014", 1, "2021/11/29");
    updateSKUItem(200, "22345678901234567890123456789014", "22345678901234567890123456789014", 1, "2021/11/29");
    getSKUItems(200, 2);
    getSKUItemsAvailableGivenSKUId(200, 1, 2);
    getSKUItemsAvailableGivenSKUId(404, 50, 0);
    getSKUItem(200, "12345678901234567890123456789014");
    getSKUItem(404, "92345678901234567890123456789014");
    updateSKUItem(200, "22345678901234567890123456789014", "32345678901234567890123456789014", 0, "2021/12/29");
    updateSKUItem(404, "92345678901234567890123456789014", "32345678901234567890123456789014", 0, "2021/12/29");
    updateSKUItem(422, "22345678901234567890123456789014", "3", 0, 2021 / 12 / 29);
    deleteSKUItem(204, "12345678901234567890123456789014");

})



function deleteAllSKUItemsTest() {
    it('clean db for skuItem APIs', function (done) {

        agent.delete('/api/deleteSKUitems')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function getSKUItems(expectedHTTPStatus, length) {
    it('getting skuItem from the system', function (done) {
        agent.get('/api/skuitems')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
};

function createSKUItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('creating a skuItem in the system', function (done) {
        let skuItem = {
            RFID: RFID,
            SKUId: SKUId,
            DateOfStock: DateOfStock
        };
        agent.post('/api/skuitem')
            .send(skuItem)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);

    })
}

function getSKUItemsAvailableGivenSKUId(expectedHTTPStatus, SKUId, length) {
    it('getting skuItems for a certain SKUId with Available = 1 from the system', function (done) {
        agent.get('/api/skuitems/sku/' + SKUId)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
};

function getSKUItem(expectedHTTPStatus, rfid) {
    it('getting a skuItem given its rfid from the system', function (done) {
        agent.get('/api/skuitems/' + rfid)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
};

function updateSKUItem(expectedHTTPStatus, rfid, newRFID, newAvailable, newDateOfStock) {
    it('update a SKUItem in the system', function (done) {
        let newSKUItem = {
            newRFID: newRFID,
            newAvailable: newAvailable,
            newDateOfStock: newDateOfStock
        };
        agent.put('/api/skuitems/' + rfid)
            .send(newSKUItem)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteSKUItem(expectedHTTPStatus, rfid) {
    it('delete a skuItem given its rfid', function (done) {
        agent.delete('/api/skuitems/' + rfid)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

module.exports = {
    createSKUItem, deleteAllSKUItemsTest, updateSKUItem
}