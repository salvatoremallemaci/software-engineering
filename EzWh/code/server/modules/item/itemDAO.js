
class ItemDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }
    //*****ITEM*****//

    //Return all the items
    getItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT ID,DESCRIPTION,PRICE,SUPPLIERID,SKUID FROM ITEM I';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        SKUId: r.SKUID,
                        supplierId: r.SUPPLIERID
                    }
                ));
                resolve(names);
            });
        });
    }

    // return an item from a SKUID

    getItemBySKUID(SKUID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM I WHERE I.SKUID= ?';
            this.db.all(sql, [SKUID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const item = rows.map((r) => (

                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        supplierID: r.SUPPLIERID,
                        idSKU: r.SKUID,
                    }
                ));
                resolve(item);
            });
        });
    }

        // return an item from a SUPPLIERID

        getItemBySUPPLIERID(supplierID) {
            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM ITEM I WHERE I.SUPPLIERID= ?';
                this.db.all(sql, [supplierID], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    const item = rows.map((r) => (
    
                        {
                            id: r.ID,
                            description: r.DESCRIPTION,
                            price: r.PRICE,
                            supplierID: r.SUPPLIERID,
                            idSKU: r.SKUID,
                        }
                    ));
                    resolve(item);
                });
            });
        }

    //Return an item by its id
    getItem(id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT ID,DESCRIPTION,PRICE,SUPPLIERID,SKUID FROM ITEM WHERE ID=? AND SUPPLIERID=?';
            this.db.all(sql, [id, supplierId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const item = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        SKUId: r.SKUID,
                        supplierId: r.SUPPLIERID
                    }
                ));
                resolve(item);
            });
        });
    }

    /* get last id of item */
    getLastIdOfItem() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM ORDER BY ID DESC LIMIT 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const item = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        SKUId: r.SKUID,
                        supplierId: r.SUPPLIERID
                    }
                ));
                resolve(item);
            });
        });
    }


    //Create a new item

    createItem(item) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SUPPLIERID,SKUID) VALUES(?, ?, ?, ?,?)';
            this.db.run(sql, [item.id, item.description, item.price, item.supplierId, item.SKUId], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };

    //Create a new item of restock order  

    createItemOfRestockOrder(item, itemId, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SUPPLIERID, SKUID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [itemId, item.description, item.price, supplierId, item.SKUId], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };


    //Return the supplier that already sells an item with the same SKUId or Id

    getSupplierforSkuIdOrId(supplierId, itemId, SkuId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCKORDER R, RESTOCKORDER_ITEM RI, ITEM I WHERE R.RESTOCKORDERID=RI.RESTOCKORDERID AND RI.ITEMID=I.ID AND ACCOUNTID=? AND RI.ITEMID=? OR I.SKUID=?';
            this.db.all(sql, [supplierId, itemId, SkuId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const restockOrder = rows.map((r) => (
                    {
                        restockId: r.RESTOCKORDERID,
                        supplierId: r.ACCOUNTID
                    }
                ));
                resolve(restockOrder);
            });
        });
    }

    //ModifyItem

    modifyItem(item, id, supplierId) {
        return new Promise((resolve, reject) => {

            const sql = 'UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ID =? AND SUPPLIERID=?';

            this.db.run(sql, [item.newDescription, item.newPrice, id, supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    //Delete an item

    deleteItem(id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEM WHERE ID =? AND SUPPLIERID=?';
            this.db.run(sql, [id, supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    }

    deleteAllItems() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEM";
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


module.exports = ItemDAO; 