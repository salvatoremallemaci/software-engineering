class positionDAO {
    sqlite = require('sqlite3');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    /***** POSITION ******/
    async getPositions() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const positions = rows.map((r) => (
                    {
                        positionID: r.ID,
                        aisleID: r.AISLEID,
                        row: r.ROW,
                        col: r.COL,
                        maxWeight: r.MAXWEIGHT,
                        maxVolume: r.MAXVOLUME,
                        occupiedWeight: r.OCCUPIEDWEIGHT,
                        occupiedVolume: r.OCCUPIEDVOLUME
                    }
                ));
                resolve(positions);
            });

        });
    }

    async getPositionByID(data) {
        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM POSITION P WHERE P.ID = ?'
            this.db.all(sql, [data], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const position = rows.map((r) => (
                    {
                        positionID: r.ID,
                        aisleID: r.AISLEID,
                        row: r.ROW,
                        col: r.COL,
                        maxWeight: r.MAXWEIGHT,
                        maxVolume: r.MAXVOLUME,
                        occupiedWeight: r.OCCUPIEDWEIGHT,
                        occupiedVolume: r.OCCUPIEDVOLUME,
                        skuID: r.SKUID
                    }
                ));
                resolve(position);
            });
        });
    }

    async updatePosition(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET ID = ?, AISLEID = ?, ROW = ?, COL = ? WHERE ID = ? ';
            this.db.run(sql, data, (err, rows) => {
                if (err) {
                    reject(err);

                    return;
                }
                resolve();
            });
        });
    }

    async modifyStorePosition(data) {
        return new Promise((resolve, reject) => {

            const sql = 'UPDATE POSITION SET ID=?, AISLEID = ?, ROW = ?, COL = ?, MAXWEIGHT = ? , MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ?  WHERE ID =? ';

            this.db.run(sql, [data[0], data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8]], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });

        });
    }

    async insertPosition(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION (ID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?,?,?,?,?,?,0,0)';

            this.db.run(sql, [data.positionID,data.aisleID,data.row,data.col,data.maxWeight,data.maxVolume], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    async deletePosition(data) {

        const sql = "DELETE FROM POSITION WHERE ID = ?";

        return new Promise((resolve, reject) => {
            this.db.run(sql, data, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    /* Delete all positions */
    deleteAllPositions() {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM POSITION";
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




module.exports = positionDAO;