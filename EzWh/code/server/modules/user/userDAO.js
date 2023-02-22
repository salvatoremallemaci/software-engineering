class userDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /* USER */

    /* Return all suppliers */
    getStoredSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT A WHERE A.ACCESSRIGHT == "supplier"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const suppliers = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL
                    }
                ));
                resolve(suppliers);
            });
        });
    }

    /* Return all users excluding managers */
    getStoredUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT A WHERE A.ACCESSRIGHT != "manager"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.ACCESSRIGHT,
                    }
                ));
                resolve(users);
            });
        });
    }

    /* Return all users*/
    getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.ACCESSRIGHT,
                    }
                ));
                resolve(users);
            });
        });
    }




    /*Return a User by username*/
    getUserbyUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT A WHERE A.EMAIL == ?'
            this.db.all(sql, [username], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const user = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        type: r.ACCESSRIGHT,
                        username: r.EMAIL,
                        password: r.PASSWORD
                    }
                ));
                resolve(user);
            });
        });
    }

    /*Return a User by username and type*/
    getUserbyUsernameAndType(username, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT A WHERE A.EMAIL == ? AND A.ACCESSRIGHT == ?'
            this.db.all(sql, [username, type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const user = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        type: r.ACCESSRIGHT,
                        username: r.EMAIL,
                        password: r.PASSWORD
                    }
                ));
                resolve(user);
            });
        });
    }

    /*Creates a new user*/
    newUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ACCOUNT(NAME, SURNAME, ACCESSRIGHT, EMAIL, PASSWORD) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.name, data.surname, data.type, data.username, data.password], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                   
                resolve(data.username);
            });
        });
    }

    /* Verify if already exists an user with same mail and accessright 
    verifySameMailAndType(user) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT A WHERE A.EMAIL == ? AND A.ACCESSRIGHT == ?';
            this.db.all(sql, [user.username, user.type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
    */
   
    /* Update accessright of an user */
    updateRights(username, newType) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE ACCOUNT SET ACCESSRIGHT = ? WHERE EMAIL = ?';
            this.db.run(sql, [newType, username], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /* Delete an user */
    deleteUser(username, type) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ACCOUNT WHERE EMAIL = ? AND ACCESSRIGHT = ?";
            this.db.run(sql, [username, type], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /* Delete all users */
    deleteAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ACCOUNT";
            this.db.run(sql, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    
    /*
    getUserInformation() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ACCOUNT';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.ACCESSRIGHT,
                    }
                ));
                resolve(users);
            });
        });
    }
    */
}

module.exports = userDAO;