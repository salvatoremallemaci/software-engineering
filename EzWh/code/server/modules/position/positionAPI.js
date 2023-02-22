
const positionDAO = require('./positionDAO');
const db_position = new positionDAO('EzWh.db');
const { check, validationResult } = require('express-validator'); // validation middleware
module.exports.useApi = function useApi(app) {

    /* POSITION */

    //update position 

    app.put('/api/position/:positionID', [
        check('positionID').isString(),
        check('newAisleID').isString(),
        check('newRow').isString(),
        check('newCol').isString(),
        check('newMaxWeight').isInt({min: 0}),
        check('newMaxVolume').isInt({min: 0}),
        check('newOccupiedWeight').isInt({min: 0}),
        check('newOccupiedVolume').isInt({min: 0})
    ], async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const id = req.body.newAisleID + req.body.newRow + req.body.newCol;
            const data = [id, req.body.newAisleID, req.body.newRow, req.body.newCol, req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume, req.params.positionID];
            data.push(data[0]);
            const position = await db_position.getPositionByID(data[8]);
            if (position.length === 0) {
                return res.status(404).end();
            }

            const result = await db_position.modifyStorePosition(data);
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }
    });

    // get positions 
    app.get('/api/positions', async (req, res) => {

        let result = db_position.getPositions()
            .then(pos => res.json(pos))
            .catch(() => res.status(500).end());

    });

    //new position 

    app.post('/api/position', [
        check('positionID').isString().isLength({ min: 12, max: 12 }),
        check('aisleID').isString().isLength({ min: 4, max: 4 }),
        check('row').isString().isLength({ min: 4, max: 4 }),
        check('col').isString().isLength({ min: 4, max: 4 }),
        check('maxWeight').isNumeric(),
        check('maxVolume').isNumeric()], async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const id = req.body.aisleID + req.body.row + req.body.col;
            const id_due = req.body.positionID;
            if (id_due !== id) {
                return res.status(422).json("match error between id and id costructors");
            }
            try {
            
                const data ={
                    positionID:req.body.positionID,
                    aisleID: req.body.aisleID,
                    row: req.body.row,
                    col:  req.body.col,
                    maxWeight: req.body.maxWeight,
                    maxVolume: req.body.maxVolume
                }
        
                const result = await db_position.insertPosition(data);
                res.status(201).end();
            } catch (e) {
                res.status(503).end();
            }
        });

    //update position ID by searching positionID

    app.put('/api/position/:positionID/changeID', [
        check('positionID').isString(),
        check('newPositionID').isString().isLength({ min: 12, max: 12 })], async (req, res) => {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const aisleID = req.body.newPositionID.slice(0, 4);
            const row = req.body.newPositionID.slice(4, 8);
            const col = req.body.newPositionID.slice(8, 12);
            const id = aisleID + row + col;
            const data = [id, aisleID, row, col, req.params.positionID];

            try {
                const position = await db_position.getPositionByID(data[4]);
                if (position.length === 0) {
                    return res.status(404).end();
                }
                const result = await db_position.updatePosition(data);
                res.status(200).end();

            } catch (e) {
                console.log(e);
                res.status(503).end();
            }

        });

    app.delete('/api/position/:positionID', [
        check('positionID').isString().isLength({ min: 12, max: 12 })
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const data = [req.params.positionID];

            const position = await db_position.getPositionByID(data[0]);
            if (position.length === 0) {
                return res.status(404).end();
            }

            const result = await db_position.deletePosition(data);
            res.status(204).end();

        } catch (e) {
            res.status(503).end();
        }

    });

    app.delete('/api/deletePositions', async (req, res) => {
        try {
            await db_position.deleteAllPositions();
            res.status(204).end();

        } catch (e) {
            res.status(500).end();
        }
    });

}
