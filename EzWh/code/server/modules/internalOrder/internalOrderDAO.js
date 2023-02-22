
class internalOrderDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }


    /* INTERNAL ORDER */

    /* Return all internal orders */
    getInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrders);
            });
        });
    }

    getInternalOrders_SKU() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER_SKU';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders_SKU = rows.map((r) => (
                    {
                        internalOrderId: r.INTERNALORDERID,
                        SKUID: r.SKUID,
                        quantity: r.QUANTITY
                    }
                ));
                resolve(internalOrders_SKU);
            });
        });
    }

    /* Return an internal order by id */
    getInternalOrderById(internalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER I WHERE I.ID == ?';
            this.db.all(sql, [internalOrderId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrder = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrder);
            });
        });
    }

    /* Return all internal orders by state */
    getInternalOrdersByState(state) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER I WHERE I.state == ?';
            this.db.all(sql, [state], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrders);
            });
        });
    }


    /* Return all produts connected to internal orders if state != COMPLETED */
    getProductsOfInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER_SKU A, SKU S WHERE A.SKUID == S.ID ORDER BY A.INTERNALORDERID';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const productsOfInternalOrder = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        qty: r.QUANTITY,
                        internalOrderId: r.INTERNALORDERID
                    }
                ));
                resolve(productsOfInternalOrder);
            });
        });
    }

    /* Return all produts connected to internal orders if state == COMPLETED */
    getProductsOfInternalOrderCompleted() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER_SKU A, SKU S, SKUITEM SK WHERE A.INTERNALORDERID == SK.INTERNALORDERID AND S.ID == SK.SKUID ORDER BY A.INTERNALORDERID';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const productsOfInternalOrderCompleted = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        RFID: r.RFID,
                        internalOrderId: r.INTERNALORDERID
                    }
                ));


                resolve(productsOfInternalOrderCompleted);

            });
        });
    }

    /* Creates a new internal order in state = ISSUED */
    newInternalOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNALORDER(ISSUEDATE, STATE, CUSTOMERID) VALUES(?, ?, ?)';
            this.db.run(sql, [data.issueDate, "ISSUED", data.customerId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /* Check if the stored quantity is enough for a new internal order */
    checkAvaiabilityOfSKUForInternalOrder(SKUId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT AVAILABLEQUANTITY FROM SKU WHERE ID == ?';
            this.db.all(sql, [SKUId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                } else {

                    const availableQuantity = rows.map((r) => (
                        {
                            quantity: r.AVAILABLEQUANTITY
                        }
                    ));

                    resolve(availableQuantity[0].quantity);
                }
            });
        });
    }

    getLastIdOfInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNALORDER ORDER BY ID DESC LIMIT 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrder = rows.map((r) => (
                    {
                        id: r.ID
                    }
                ));
                resolve(internalOrder[0].id);
            });
        });
    }

    /* Associate products to Internal Order */
    newInternalOrder_SKU(internalOrderId, SKUID, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNALORDER_SKU(INTERNALORDERID, SKUID, QUANTITY) VALUES(?, ?, ?)';
            this.db.run(sql, [internalOrderId, SKUID, quantity], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    /* Modify the state of an internal order */
    decreaseQuantityOfSKUForInternalOrder(SKUId, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET AVAILABLEQUANTITY = AVAILABLEQUANTITY - ? WHERE ID = ?';
            this.db.run(sql, [quantity, SKUId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(this.changes);
                }

            });
        });
    }

    /* Modify the state of an internal order */
    increaseQuantityOfSKUForInternalOrder(SKUId, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET AVAILABLEQUANTITY = AVAILABLEQUANTITY + ? WHERE ID = ?';
            this.db.run(sql, [quantity, SKUId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(this.changes);
                }

            });
        });
    }

    getPositionIdBySKUId(SKUId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT POSITIONID FROM SKU WHERE ID = ?';
            this.db.all(sql, [SKUId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const positionID = rows.map((r) => (
                    {
                        positionID: r.POSITIONID
                    }
                ));
                resolve(positionID[0].positionID);
            });
        });
    }


    decreasePositionInternalOrder(positionId, quantity) {


        const sql = "SELECT SKU.VOLUME, SKU.WEIGHT FROM SKU, POSITION WHERE SKU.POSITIONID = POSITION.ID AND POSITION.ID = ?";

        return new Promise((resolve, reject) => {
            this.db.get(sql, [positionId], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {


                    const totVolume = row.VOLUME * quantity;
                    const totWeight = row.WEIGHT * quantity;

                    const secondSql = "UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT - ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME - ? WHERE ID = ?";

                    this.db.run(secondSql, [totWeight, totVolume, positionId], function (err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                            return;
                        } else {
                            resolve(this.changes);
                        }
                    });

                }

            });

        });

    }

    increasePositionInternalOrder(positionId, quantity) {


        const sql = "SELECT SKU.VOLUME, SKU.WEIGHT FROM SKU, POSITION WHERE SKU.POSITIONID = POSITION.ID AND POSITION.ID = ?";

        return new Promise((resolve, reject) => {
            this.db.get(sql, [positionId], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {


                    const totVolume = row.VOLUME * quantity;
                    const totWeight = row.WEIGHT * quantity;

                    const secondSql = "UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT + ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME + ? WHERE ID = ?";

                    this.db.run(secondSql, [totWeight, totVolume, positionId], function (err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(this.changes);
                        }
                    });

                }

            });

        });

    }


    /* Modify the state of an internal order */
    updateInternalOrder(internalOrderId, newState) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INTERNALORDER SET STATE = ? WHERE ID = ?';
            this.db.run(sql, [newState, internalOrderId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes);
            });
        });
    }

    /* Add the internalOrder of an SKUITEM */
    updateInternalOrderIdOfSKUItem(SkuID, RFID, internalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET INTERNALORDERID = ?, AVAILABLE = 0  WHERE RFID == ? AND SKUID == ?';
            this.db.run(sql, [internalOrderId, RFID, SkuID], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(this.changes);
                }

            });
        });
    }

    /* Delete an internalOrder */
    deleteInternalOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM INTERNALORDER WHERE ID = ?";
            this.db.run(sql, [id], function (err) {
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


    deleteInternalOrder_SKU(internalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM INTERNALORDER_SKU WHERE INTERNALORDERID = ?";
            this.db.run(sql, [internalOrderId], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }


    deleteInternalOrder_SKUITEM(internalOrderId) {
        return new Promise((resolve, reject) => {
            // const sql = "DELETE FROM SKUITEM WHERE INTERNALORDERID = ?";
            const sql = "UPDATE SKUITEM SET INTERNALORDERID = NULL, AVAILABLE = 1 WHERE INTERNALORDERID = ?";
            this.db.run(sql, [internalOrderId], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }


    deleteAllInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM INTERNALORDER";
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

    deleteAllInternalOrders_SKU() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM INTERNALORDER_SKU";
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

    deleteAllSkuItem() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKUITEM";
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

    updateSkuItemForInternalOrder(RFID, internalOrderId) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE SKUITEM SET INTERNALORDERID = ? WHERE RFID = ?";

            this.db.run(sql, [internalOrderId, RFID], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }

}


module.exports = internalOrderDAO;