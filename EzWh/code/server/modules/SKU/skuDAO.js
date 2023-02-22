class skuDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /*Return all SKUS*/
    getStoredSKUS() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU S';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const SKU = rows.map((r) => (

                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        position: r.POSITIONID,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        price: r.PRICE,
                    }
                ));
                resolve(SKU);
            });
        });
    }

    /*Return a SKU by ID*/
    getSKUbyID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU S WHERE S.ID= ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const sku = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        position: r.POSITIONID,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        price: r.PRICE,
                    }
                ));
                resolve(sku);
            });
        });
    }

    /*Creates a new SKU*/
    async newSKU(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, AVAILABLEQUANTITY, VOLUME, PRICE, NOTES) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.availableQuantity, data.volume, data.price, data.notes], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /*Modify SKU */
    async modifySku(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, AVAILABLEQUANTITY = ?, VOLUME = ?,  PRICE = ?, NOTES = ? WHERE SKU.ID = ?';
            this.db.run(sql, [data.newDescription, data.newWeight, data.newAvailableQuantity, data.newVolume, data.newPrice, data.newNotes, data.skuID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            
            if (data.position !== null) {
                const sql2 = 'UPDATE POSITION SET OCCUPIEDVOLUME = ?, OCCUPIEDWEIGHT = ? WHERE ID = ?';

                this.db.run(sql2, [data.volumeTOT, data.weightTOT, data.position], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                });
            }
            
            resolve();
        });
    }


    /*Modify SKU Position*/
    async modifySkuPosition(data) {
        return new Promise((resolve, reject) => {

            const sql1 = 'UPDATE SKU SET POSITIONID = ? WHERE SKU.ID = ?';

            this.db.run(sql1, [data.positionID, data.skuID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            const sql2 = 'UPDATE POSITION SET OCCUPIEDVOLUME = ?, OCCUPIEDWEIGHT = ?, SKUID = ? WHERE ID = ?';

            this.db.run(sql2, [data.newVolume, data.newWeight, data.skuID, data.positionID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            resolve();

        });
    }


    deletePositionSKU(positionId, quantity) {


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

                    const secondSql = "UPDATE POSITION SET SKUID = ?, OCCUPIEDWEIGHT = OCCUPIEDWEIGHT - ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME - ? WHERE ID = ?";

                    this.db.run(secondSql, [null, totWeight, totVolume, positionId], function (err) {
                        if (err) {
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


    //deleteSKU
    async deleteSKU(id) {
        const sql = "DELETE FROM SKU WHERE SKU.ID = ?";
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


    //deleteAllSKU
    async deleteAllSKUs() {
        const sql = "DELETE FROM SKU";
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


    getLastSKU() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU ORDER BY ID DESC LIMIT 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const sku = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        position: r.POSITIONID,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        price: r.PRICE,
                    }
                ));
                resolve(sku);
            });
        });
    }


}

module.exports = skuDAO;
