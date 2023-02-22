
class testDescriptorDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /***** TEST DESCRIPTION ******/
    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTOR T';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const testDescriptors = rows.map((r) => (

                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDUREDESCRIPTOR,
                        idSKU: r.SKUID,
                    }
                ));
                resolve(testDescriptors);
            });
        });
    }

    getTestDescriptorByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTOR T WHERE T.ID= ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const testDescriptor = rows.map((r) => (

                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDUREDESCRIPTOR,
                        idSKU: r.SKUID,
                    }
                ));
                resolve(testDescriptor);
            });
        });
    }



    async newTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TESTDESCRIPTOR(NAME, PROCEDUREDESCRIPTOR, SKUID) VALUES( ?, ?, ?)';
            this.db.run(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }


    /*Modify TestDescriptor */
    async modifyTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTDESCRIPTOR SET NAME = ?, PROCEDUREDESCRIPTOR = ?, SKUID = ? WHERE ID = ?';
            this.db.run(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, data.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //delete Test Descriptor
    async deleteTestDescriptor(id) {
        const sql = "DELETE FROM TESTDESCRIPTOR WHERE TESTDESCRIPTOR.ID = ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, id, (error, rows) => {
                if (error) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    async deleteAllTestDescriptor() {
        const sql = "DELETE FROM TESTDESCRIPTOR";
        return new Promise((resolve, reject) => {
            this.db.all(sql, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();


            });
        });
    }
}



module.exports = testDescriptorDAO;