const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Position APIs', () => {

    /*
    beforeEach(async () => {
        await agent.delete('/api/users/allUsers');
    })
    */
    deleteAllPositions();
    createPosition(201, "800234543411", "8002", "3454", "3411", 1000, 1000);
    createPosition(201, "800270001002", "8002", "7000", "1002", 1000, 1000);
    //422 because 3412 should be a string
    createPosition(422, "800234543411", "8002", "3454", 3411, 1000, 1000);
    getPositions(200, 2);
    updatePosition(200,"800234543411","8002","3454","3411",1200,600,200,100);
    updatePosition(422,"800234543411",8002,"3454","3411",1200,600,200,100);
    updatePosition(404,"800234543450","8002","3454","3450",1200,600,200,100);
    modifyPositionID(200,"800270001002","800270001010");
    modifyPositionID(422,"800234543412",800270001011);
    modifyPositionID(404,"800270001000","800270001013");
    deletePosition(204, "800234543411");
})

function deleteAllPositions() {
    it('clean db for position APIs', function (done) {

        agent.delete('/api/deletePositions')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function getPositions(expectedHTTPStatus, length) {
    it('getting positions from the system', function (done) {
        agent.get('/api/positions')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            });
    });
};

function createPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('creating a position in the system', function (done) {
        let position = {
            positionID: positionID,
            aisleID: aisleID,
            row: row,
            col: col,
            maxWeight: maxWeight,
            maxVolume: maxVolume
        };
        agent.post('/api/position')
            .send(position)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/positions')
                    .then(function (r2) {
                        if (r1.status != 422) {
                            for (const elem of r2.body) {
                                if (position.positionID == elem.positionID) {
                                    elem.aisleID.should.have.equal(position.aisleID);
                                }
                            }
                            if (r2.body.length == 0) {
                                r2.should.have.status(500);
                            }
                        }
                        r2.should.have.status(200);
                        done();
                    });
            });
    });
}


function updatePosition(expectedHTTPStatus, positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
    it('update a position in the system', function (done) {
        let newPosition = {
            positionID: positionID,
            newAisleID: newAisleID,
            newRow: newRow,
            newCol: newCol,
            newMaxWeight: newMaxWeight,
            newMaxVolume: newMaxVolume,
            newOccupiedWeight: newOccupiedWeight,
            newOccupiedVolume: newOccupiedVolume

        };
        agent.put('/api/position/' + positionID)
            .send(newPosition)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyPositionID(expectedHTTPStatus, positionID,newPositionID) {
    it('update a positionID in the system', function (done) {
        let newPosition = {
            newPositionID: newPositionID,
        };
        agent.put('/api/position/'+positionID+'/changeID')
            .send(newPosition)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deletePosition(expectedHTTPStatus, positionID) {
    it('delete a position given its ID, for position APIs', function (done) {
        agent.delete('/api/position/'+positionID)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


module.exports = {
    createPosition,
    deleteAllPositions
}