
class returnOrderDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /* RETURN ORDER */

    /* Return all return orders */
    getReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURNORDER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.RETURNDATE,
                        restockOrderId: r.RESTOCKORDERID
                    }
                ));
                resolve(returnOrders);
            });
        });
    }

    /* Return all SKUITEMS connected to return orders */
    getProductsOfReturnOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT SK.SKUID, I.ID, I.DESCRIPTION, I.PRICE, SK.RFID, SK.RETURNORDERID FROM SKU S, SKUITEM SK, ITEM I WHERE S.ID == SK.SKUID AND I.SKUID = S.ID ORDER BY SK.RETURNORDERID';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const productsOfReturnOrder = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        itemId: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        RFID: r.RFID,
                        returnOrderId: r.RETURNORDERID
                    }

                ));
                // console.log(productsOfReturnOrder);
                resolve(productsOfReturnOrder);
            });
        });
    }

    /* Return a return order by id */
    getReturnOrderById(returnOrderID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURNORDER R WHERE R.ID == ?';
            this.db.all(sql, [returnOrderID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnOrder = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.RETURNDATE,
                        restockOrderId: r.RESTOCKORDERID
                    }
                ));
                resolve(returnOrder);
            });
        });
    }

    /* Creates a new return order */
    newReturnOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURNORDER(RETURNDATE, RESTOCKORDERID) VALUES(?, ?)';
            this.db.run(sql, [data.returnDate, data.restockOrderId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    getLastIdOfReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURNORDER ORDER BY ID DESC LIMIT 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnOrder = rows.map((r) => (
                    {
                        id: r.ID
                    }
                ));
                resolve(returnOrder[0].id);
            });
        });
    }

    /*
    newReturnOrder_SKU(returnOrderId, SKUID) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURNORDER_SKU(RETURNORDERID, SKUID) VALUES(?, ?)';
            this.db.run(sql, [returnOrderId, SKUID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    */

    /* Add the returnOrder of an SKUITEM */
    updateReturnOrderIdOfSKUItem(SkuID, RFID, returnOrderId) {
        return new Promise((resolve, reject) => {
            // AVAILABLE = 0 ????
            const sql = 'UPDATE SKUITEM SET RETURNORDERID = ?, AVAILABLE = 0  WHERE RFID == ? AND SKUID == ?';
            this.db.run(sql, [returnOrderId, RFID, SkuID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }


    /* Delete a returnOrder */
    deleteReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RETURNORDER WHERE ID = ?";
            this.db.run(sql, [id], (err) => {
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
    deleteReturnOrder_SKU(returnOrderId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RETURNORDER_SKU WHERE RETURNORDERID = ?";
            this.db.run(sql, [returnOrderId], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    */

    // CANCELLO PROPRIO O METTO RETURNORDER = NULL E AVAILABLE 1???
    deleteReturnOrder_SKUITEM(returnOrderId) {
        return new Promise((resolve, reject) => {
            // const sql = "DELETE FROM SKUITEM WHERE RETURNORDERID = ?";
            const sql = "UPDATE SKUITEM SET RETURNORDERID = NULL, AVAILABLE = 1 WHERE RETURNORDERID = ?";
            this.db.run(sql, [returnOrderId], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    /* Delete all return orders */
    deleteAllReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RETURNORDER";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

} 


module.exports =  returnOrderDAO;