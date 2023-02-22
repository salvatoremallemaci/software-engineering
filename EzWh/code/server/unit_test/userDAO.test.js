const userDAO = require('../modules/user/userDAO');
const db_user = new userDAO('EzWh.db');

describe('userDAO test', () => {

    deleteAllUsersTest();
    newUserTest();
    getSuppliersTest();
    getStoredUsersTest();
    getUserbyUsernameAndTypeTest();
    updateRightsTest();
    deleteUserTest();

});

function deleteAllUsersTest() {
    test('delete db', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);
    });
}


function newUserTest() {
    test('create new user', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);


        const data = {
            username: "ciao@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(data);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        res = await db_user.getUserbyUsername(data.username);
        let user = res[0];

        expect(user.username).toStrictEqual(data.username);
        expect(user.name).toStrictEqual(data.name);
        expect(user.surname).toStrictEqual(data.surname);
        expect(user.password).toStrictEqual(data.password);
        expect(user.type).toStrictEqual(data.type);

    });
}

function getSuppliersTest() {
    test('get suppliers', async () => {

        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user1 = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const user2 = {
            username: "ciao2@gmail.com",
            name: "marco",
            surname: "bianchi",
            password: "ciaociao",
            type: "clerk",
        };

        const user3 = {
            username: "ciao3@gmail.com",
            name: "matteo",
            surname: "verdi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user1);
        await db_user.newUser(user2);
        await db_user.newUser(user3);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(3);

        res = await db_user.getStoredSuppliers();
        expect(res.length).toStrictEqual(2);

        expect(res[0].email).toStrictEqual(user1.username);
        expect(res[1].email).toStrictEqual(user3.username);


    });
}


function getStoredUsersTest() {

    test('get all users excluding managers', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user1 = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const user2 = {
            username: "ciao2@gmail.com",
            name: "marco",
            surname: "bianchi",
            password: "ciaociao",
            type: "manager",
        };

        await db_user.newUser(user1);
        await db_user.newUser(user2);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(2);

        res = await db_user.getStoredUsers();
        expect(res.length).toStrictEqual(1);

        expect(res[0].email).toStrictEqual(user1.username);

    });

}

function getUserbyUsernameAndTypeTest() {
    test('get user by username and type', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user1 = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user1);
        
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);

        res = await db_user.getUserbyUsernameAndType(user1.username, user1.type);
        expect(res.length).toStrictEqual(1);

        expect(res[0].username).toStrictEqual(user1.username);
        expect(res[0].type).toStrictEqual(user1.type);

    });
}


function updateRightsTest() {
    test('update the rights of an existing user', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);


        const user1 = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        await db_user.newUser(user1);
        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);


        const newType = "clerk";
        await db_user.updateRights(user1.username, newType);
        res = await db_user.getUserbyUsernameAndType(user1.username, newType);
        expect(res.length).toStrictEqual(1);

        expect(res[0].username).toStrictEqual(user1.username);
        expect(res[0].type).toStrictEqual(newType);

    });
}

function deleteUserTest(){
    test('delete user', async () => {
        await db_user.deleteAllUsers();
        let res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(0);

        const user1 = {
            username: "ciao1@gmail.com",
            name: "giorgio",
            surname: "rossi",
            password: "ciaociao",
            type: "supplier",
        };

        const user2 = {
            username: "ciao2@gmail.com",
            name: "marco",
            surname: "bianchi",
            password: "ciaociao",
            type: "clerk",
        };

        await db_user.newUser(user1);
        await db_user.newUser(user2);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(2);

        res = await db_user.deleteUser(user1.username, user1.type);

        res = await db_user.getAllUsers();
        expect(res.length).toStrictEqual(1);


    });
}

