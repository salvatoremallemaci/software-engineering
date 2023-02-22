const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('Multiple creation of users', () => {
    deleteAllUsersAPITest();
    newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "clerk");
    newUserAPITest(409, "Mauro", "Giordano", "password", "giordano@gmail.com", "clerk");
    newUserAPITest(422, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "manager");
    newUserAPITest(201, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "supplier");
    newUserAPITest(409, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "supplier");
    newUserAPITest(422, "Paolo", "Rossi", "password", "paolo@gmail.com", "administrator");
    newUserAPITest(201, "Paolo", "Rossi", "password", "paolo@gmail.com", "qualityEmployee");
})

describe('Get suppliers', () => {
    deleteAllUsersAPITest();
    newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "clerk");
    newUserAPITest(201, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "supplier");
    newUserAPITest(201, "Po", "Yo", "password", "poyoo@gmail.com", "supplier");
    newUserAPITest(201, "Paolo", "Rossi", "password", "paolo@gmail.com", "qualityEmployee");
    getSuppliersAPITest(200, 2);
})

describe('Get users (all excluding managers)', () => {
    deleteAllUsersAPITest();
    newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "clerk");
    newUserAPITest(201, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "supplier");
    newUserAPITest(201, "Po", "Yo", "password", "poyoo@gmail.com", "supplier");
    newUserAPITest(201, "Paolo", "Rossi", "password", "paolo@gmail.com", "qualityEmployee");
    getUsersAPITest(200, 4);
})

describe('Update rights of a user', () => {
    deleteAllUsersAPITest();
    newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "clerk");
    updateRightsAPITest(200, "giordano@gmail.com", "clerk", "supplier");
    updateRightsAPITest(422, "peppe@gmail.com", "clerk");
    updateRightsAPITest(404, "giordano@gmail.com", "clerk", "supplier");
    updateRightsAPITest(404, "giordano@gmail.com", "manager", "supplier");
})


describe('Deletion of users', () => {
    deleteAllUsersAPITest();
    newUserAPITest(201, "Giorgio", "Bianchi", "password", "giorgio@gmail.com", "supplier");
    newUserAPITest(201, "Mauro", "Giordano", "password", "giordano@gmail.com", "supplier");
    deleteUserAPITest(204, "giordano@gmail.com", "supplier");
})

function getSuppliersAPITest(expectedHTTPStatus, expectedLength) {
    it('getting suppliers from the system', function (done) {
        // let user1 = { username: username, name: name, surname: surname, password: password, type: type}
        agent.get('/api/suppliers')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            });
    });
}

function getUsersAPITest(expectedHTTPStatus, expectedLength) {
    it('getting users from the system', function (done) {
        // let user1 = { username: username, name: name, surname: surname, password: password, type: type}
        agent.get('/api/users')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(expectedLength);
                done();
            });
    });
}

function newUserAPITest(expectedHTTPStatus, name, surname, password, username, type) {
    it('new user', function (done) {
        const user = { name: name, surname: surname, password: password, username: username, type: type }

        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
                /*
                agent.get('/api/users')
                    .then(function (r) {
                        if (r.status != 422) {
                            for (const elem of r.body) {
                            
                                if (user.username == elem.email) {
                                    elem.name.should.have.equal(user.name);
                                    elem.surname.should.have.equal(user.surname);
                                    
                                }

                            }
                        }
                        r2.should.have.status(200)
                        done();
                    });
                    */
            });
    });
}


function updateRightsAPITest(expectedHTTPStatus, username, oldType, newType) {
    it('update rights of an user', function (done) {

        const types = { "oldType": oldType, "newType": newType };
        const url = '/api/users/' + username;

        agent.put(url)
            .send(types)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function deleteUserAPITest(expectedHTTPStatus, username, type) {
    it('delete a user', function (done) {
        const url = '/api/users/' + username + '/' + type;
        agent.delete(url)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteAllUsersAPITest() {
    it('clean db for account APIs', function (done) {

        agent.delete('/api/users/allUsers')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

module.exports = {
    newUserAPITest,
    deleteAllUsersAPITest
}