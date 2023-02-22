const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const SKUItemFunction = require('./testSKUItemAPI');
const SKUFunction = require('./testSkuAPI');
var agent = chai.request.agent(app);

describe('Multiple creation of Item', () => {
    deleteAllItemAPITest();

    SKUFunction.deleteAllSKUAPITest();
    SKUFunction.newSKUAPITest(201, "description of a SKU1", 10, 11, 14, 15, "sku notes1");
    SKUFunction.newSKUAPITest(201, "description of a SKU2", 11, 12, 13, 14, "sku notes2");

    SKUItemFunction.deleteAllSKUItemsTest();
    SKUItemFunction.createSKUItem(201, "12345678901234567890123456789016", 1, "2021/11/29");;

    newItemAPITest(201, 12, "a new item", 10.99, 1, 2);
    newItemAPITest(201, 13, "a new item", 11.99, 2, 3);
})

describe('Get Items', () => {
    deleteAllItemAPITest();

    newItemAPITest(201, 12, "a new item", 10.99, 1, 2);
    newItemAPITest(201, 13, "a new item", 11.99, 2, 3);

    getItemAPITest(200, 2);
})

describe('Get Item by ID', () => {
    deleteAllItemAPITest();

    newItemAPITest(201, 12, "a new item", 10.99, 1, 2);

    getItembyIDAPITest(200, 1, 12, 2);
})

describe('Update Item', () => {
    deleteAllItemAPITest();
    newItemAPITest(201, 12, "a new item", 10.99, 1, 2);
    const newItem = {
        newDescription: "new desc",
        newPrice: 5.50
    }
    updateItemAPITest(200, 12, newItem,2);
})


describe('Deletion of Item', () => {
    deleteAllItemAPITest();
    newItemAPITest(201, 12, "a new item", 10.99, 1, 2);
    deleteItemAPITest(204, 12, 2);
})

function getItemAPITest(expectedHTTPStatus, expectedLength) {
    it('getting Item from the system', function (done) {

        agent.get('/api/items')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            })
            .catch(done);
    });

}

function getItembyIDAPITest(expectedHTTPStatus, expectedLength, id, supplierId) {
    it('getting Item by id from the system', function (done) {

        agent.get('/api/items/' + id+'/'+supplierId)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.have.equal(id);
                done();
            })
            .catch(done);
    });
}


function newItemAPITest(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('new item', function (done) {
        const item = {
            id: id,
            description: description,
            price: price,
            SKUId: SKUId,
            supplierId: supplierId
        }


        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function updateItemAPITest(expectedHTTPStatus, id, newItem, supplierId) {
    it('update Item in the system', function (done) {

        agent.put('/api/item/' +id+'/'+supplierId)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(done);
    });
}


function deleteItemAPITest(expectedHTTPStatus, id, supplierId) {
    it('delete a item', function (done) {
        const url = '/api/items/' +id+'/'+supplierId;
        agent.delete(url)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(done);;
    });
}

function deleteAllItemAPITest() {
    it('clean db for Item', function (done) {

        agent.delete('/api/item/deleteAll')
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
            .catch(done);
    });
}

module.exports = {
    deleteAllItemAPITest,
    newItemAPITest
}