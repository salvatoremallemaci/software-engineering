
class restockOrderDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    } 
    //*****RESTOCK ORDER*****//

    //Return all restock order
    getRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RESTOCKORDERID,ISSUEDATE,STATE,ACCOUNTID,TRANSPORTNOTE FROM RESTOCKORDER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const order = rows.map((r) => (
                    {
                        id: r.RESTOCKORDERID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        supplierId: r.ACCOUNTID,
                        transportNote: { deliveryDate: r.TRANSPORTNOTE }
                    }

                ));
                resolve(order);
            });
        });
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER_ITEM RI ,ITEM I WHERE RI.ITEMID=I.ID';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const result = rows.map((r) => (

                    {
                        itemId: r.ITEMID,
                        restockOrder: r.RESTOCKORDERID,
                        SKUId: r.SKUID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        qty: r.QUANTITY
                    }
                ));
                //console.log(result);
                resolve(result);
            });
        });
    }

    //Return all the items detail of an order

    getSKUItemsForOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RESTOCKORDERID=?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuItems = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        rfid: r.RFID
                    }
                ));
                resolve(skuItems);
            });
        });
    }

    //Return all orders with state ISSUED

    getRestockOrdersIssued() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RESTOCKORDERID,ISSUEDATE,STATE,ACCOUNTID,TRANSPORTNOTE FROM RESTOCKORDER WHERE STATE="ISSUED"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const order = rows.map((r) => (
                    {
                        id: r.RESTOCKORDERID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        supplierId: r.ACCOUNTID,
                        transportNote: { deliveryDate: r.TRANSPORTNOTE }
                    }
                ));
                resolve(order);
            });
        });
    }

    //Return a Restock order by its id

    getRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RESTOCKORDERID,ISSUEDATE,STATE,ACCOUNTID,TRANSPORTNOTE FROM RESTOCKORDER WHERE RESTOCKORDERID=?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const order = rows.map((r) => (
                    {
                        id: r.RESTOCKORDERID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        supplierId: r.ACCOUNTID,
                        transportNote: { deliveryDate: r.TRANSPORTNOTE }
                    }

                ));
                resolve(order);
            });
        });
    }

    //return all items of an order that failed atleast one test

    returnItem(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT DISTINCT SI.RFID,SI.SKUID FROM SKUITEM SI, RESTOCKORDER_ITEM RI, TESTRESULT T WHERE SI.RFID=T.RFID AND SI.RESTOCKORDERID=? AND T.RESULT=0 AND RI.RESTOCKORDERID=?';
            this.db.all(sql, [id,id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const returnItems = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        itemId: r.ITEMID,
                        rfid: r.RFID
                    }

                ));
                resolve(returnItems);
            });
        });
    }

    //Create a new Restock Order with state=ISSUED

    createRestockOrder(order) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDER(ISSUEDATE, STATE,ACCOUNTID) VALUES(?, ?, ?)';
            this.db.run(sql, [order.issueDate, "ISSUED", order.supplierId], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };

    //Get last order

    lastOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER ORDER BY RESTOCKORDERID DESC LIMIT 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const order = rows.map((r) => (
                    {
                        id: r.RESTOCKORDERID
                    }
                ));
                resolve(order[0].id);
            });
        });
    };


    getSKUForRestockOrder(restockOrderId){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RI.RESTOCKORDERID, RI.QUANTITY, I.SKUID FROM RESTOCKORDER_ITEM RI, ITEM I WHERE RI.ITEMID == I.ID AND RI.RESTOCKORDERID == ?';
            this.db.all(sql, [restockOrderId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skus = rows.map((r) => (
                    {
                        restockOrderId: r.RESTOCKORDERID,
                        quantity: r.QUANTITY,
                        SKUId: r.SKUID
                    }
                ));
                resolve(skus);
            });
        });
    }



    //Insert of new rows in RESTOCKORDER_ITEM for the creation of a new order

    newRestockOrder_Item(id, itemId, qty) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDER_ITEM(RESTOCKORDERID, ITEMID, QUANTITY) VALUES(?, ?, ?)';
            this.db.run(sql, [id, itemId, qty], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //Modify state of a RestockOrder

    modifyStateRestockOrder(state, id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCKORDER SET STATE = ? WHERE RESTOCKORDERID =? ';
            this.db.run(sql, [state.newState, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    //Modify transport note of a restock order

    modifyNote(note, id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCKORDER SET TRANSPORTNOTE = ? WHERE RESTOCKORDERID =? ';
            this.db.run(sql, [note.transportNote.deliveryDate, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    //Delete a RestockOrder.

    deleteRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCKORDER WHERE RESTOCKORDERID =? ';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });

        });
    }

    deleteRestockOrder_Item(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCKORDER_ITEM WHERE RESTOCKORDERID =? ';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });

        });
    }

    // UPDATE LIST OF SKUITEM GIVEN RESTOCKORDERID
    updateSKUITEM_available(RFID, id, available) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET RESTOCKORDERID = ?, AVAILABLE = ? WHERE RFID =? ';
            this.db.run(sql, [id, available, RFID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }


    deleteAllRestockOrders(){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RESTOCKORDER";
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

    deleteAllRestockOrder_Item(){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RESTOCKORDER_ITEM";
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


module.exports = restockOrderDAO;