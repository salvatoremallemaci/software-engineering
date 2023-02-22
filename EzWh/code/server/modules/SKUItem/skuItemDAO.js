class skuItemDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }


    /***********SKU ITEM*******/
    //GET all SKU Item
    getSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUITEM = rows.map((r) => (

                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK,
                    }
                ));
                resolve(SKUITEM);
            });
        });
    }

    //GET sku item by skuid
    getSKUItemsBySKUID(SKUId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE SKUID = ? AND AVAILABLE = 1';
            this.db.all(sql, [SKUId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUITEM = rows.map((r) => (

                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        DateOfStock: r.DATEOFSTOCK,
                    }
                ));
                resolve(SKUITEM);
            });
        });
    }


    //GET SKU Item by rfid
    getSKUItemsByRFID(RFID) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
            this.db.all(sql, [RFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKUITEM = rows.map((r) => (

                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK,
                    }
                ));
                resolve(SKUITEM);
            });
        });
    }

    /*Creates a new SKU ITEM*/
    async newSKUItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUITEM(RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [data.RFID, data.SKUId, 0, data.DateOfStock], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }


    /*Modify SKUITEM */
    async modifySkuItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATEOFSTOCK = ? WHERE SKUITEM.RFID = ?';
            this.db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, data.rfid], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //delete SKU Item
    async deleteSKUItem(rfid) {
        const sql = "DELETE FROM SKUITEM WHERE SKUITEM.RFID = ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [rfid], (error, rows) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    //delete SKU Item
    deleteAllSKUItems() {
        const sql = "DELETE FROM SKUITEM";
        return new Promise((resolve, reject) => {
            this.db.all(sql, (error, rows) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

}


module.exports = skuItemDAO;