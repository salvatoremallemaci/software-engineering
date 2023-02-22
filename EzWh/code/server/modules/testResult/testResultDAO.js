
class testResultDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /******** TEST RESULT **********/

    getTestResults(data) {
        const sql = 'SELECT * FROM TESTRESULT WHERE RFID = ?';

        return new Promise((resolve, reject) => {
            this.db.all(sql, data, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const testResults = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.TESTDESCRIPTIONID,
                        Date: r.DATE,
                        Result: r.RESULT === 1 ? true : false

                    }
                ));
                resolve(testResults);
            });
        });
    }

    getTestResult(data) {
        const sql = 'SELECT * FROM TESTRESULT WHERE RFID = ? AND ID = ?';
      
        return new Promise((resolve, reject) => {
            this.db.get(sql, data, (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    if (typeof row !== 'undefined') {
                        const testResult = {
                            id: row.ID,
                            idTestDescriptor: row.TESTDESCRIPTIONID,
                            Date: row.DATE,
                            Result: row.RESULT === 1 ? true : false
                        }
                        resolve(testResult);
                    } else {
                        resolve(undefined);
                    }

                }

            });
        });
    }

    insertTestResult(data) {
        const sql = 'INSERT INTO TESTRESULT ( DATE, RESULT, TESTDESCRIPTIONID, RFID) VALUES( ? , ? , ? ,? ); '

        return new Promise((resolve, reject) => {
            this.db.run(sql, data, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }


    updateTestResult(data) {

        const sql = "UPDATE TESTRESULT SET DATE = ? , TESTDESCRIPTIONID = ? , RESULT = ? WHERE ID = ? AND RFID = ?";

        return new Promise((resolve, reject) => {
            this.db.run(sql, data, function (err) {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    resolve(this.changes);
                }

            });


        });
    }




    deleteTestResult(data) {
        const sql = "DELETE FROM TESTRESULT WHERE RFID = ? AND ID = ?";

        return new Promise((resolve, reject) => {


            this.db.run(sql, data, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    resolve(this.changes);
                }


            });



        });
    }

    deleteAllTestResult(){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM TESTRESULT";
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

    
}


module.exports = testResultDAO;