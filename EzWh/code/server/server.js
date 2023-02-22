'use strict';
const express = require('express');
const sqlite = require('sqlite3');

//const morgan = require('morgan'); // logging middleware
// const DAO = require('./DAO');
// const { check, param, body, validationResult } = require('express-validator'); // validation middleware

const userAPIs = require('./modules/user/userAPI');
const internalOrderAPIs = require('./modules/internalOrder/internalOrderAPI');
const skuAPIs = require('./modules/SKU/skuAPI');
const skuItemAPIs = require('./modules/SKUItem/skuItemAPI');
const positionAPIs = require('./modules/position/positionAPI');
const testDescriptorAPIs = require('./modules/testDescriptor/testDescriptorAPI');
const testResultAPIs = require('./modules/testResult/testResultAPI');
const returnOrderAPIs = require('./modules/returnOrder/returnOrderAPI');
const itemAPIs = require('./modules/item/itemAPI');
const restockOrderAPIs = require('./modules/restockOrder/restockOrderAPI');

// init express
const app = new express();
const port = 3001;

app.use(express.json());
//const db = new DAO('EzWh.db');

userAPIs.useApi(app);
internalOrderAPIs.useApi(app);
skuAPIs.useApi(app);
skuItemAPIs.useApi(app);
positionAPIs.useApi(app);
testDescriptorAPIs.useApi(app);
testResultAPIs.useApi(app);
returnOrderAPIs.useApi(app);
itemAPIs.useApi(app);
restockOrderAPIs.useApi(app);


const db = new sqlite.Database('EzWh.db', (err) => {
  if (err) throw err;
});
handleDB();
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
db.get("PRAGMA busy_timeout = 30000");

async function createTable() {
  return new Promise((resolve, reject) => {

    let sql = 'CREATE TABLE IF NOT EXISTS "INTERNALORDER_SKU" ( "INTERNALORDERID"	INTEGER NOT NULL, "SKUID"	INTEGER, "QUANTITY"	INTEGER NOT NULL, FOREIGN KEY("SKUID") REFERENCES "SKU"("ID"), FOREIGN KEY("INTERNALORDERID") REFERENCES "INTERNALORDER"("ID"), PRIMARY KEY("INTERNALORDERID","SKUID") );';

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "ITEM" (	"ID"	INTEGER NOT NULL,	"DESCRIPTION"	TEXT NOT NULL, "PRICE"	REAL NOT NULL,
      "SUPPLIERID"	INTEGER NOT NULL,
      "SKUID"	INTEGER NOT NULL,
      FOREIGN KEY("SKUID") REFERENCES "SKU"("ID"),
      FOREIGN KEY("SUPPLIERID") REFERENCES "ACCOUNT"("ID"),
      PRIMARY KEY("ID")
    );`;

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "TESTDESCRIPTOR" (
	"ID"	INTEGER NOT NULL,
	"NAME"	TEXT NOT NULL,
	"PROCEDUREDESCRIPTOR"	TEXT NOT NULL,
	"SKUID"	INTEGER NOT NULL,
	PRIMARY KEY("ID")
);`;

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "ACCOUNT" (
      "ID"	INTEGER NOT NULL,
      "NAME"	TEXT NOT NULL,
      "SURNAME"	TEXT NOT NULL,
      "ACCESSRIGHT"	TEXT NOT NULL,
      "EMAIL"	TEXT NOT NULL,
      "PASSWORD"	TEXT NOT NULL,
      PRIMARY KEY("ID")
    );`;

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "INTERNALORDER" (
	"ID"	INTEGER NOT NULL,
	"ISSUEDATE"	TEXT NOT NULL,
	"STATE"	TEXT NOT NULL,
	"CUSTOMERID"	INTEGER NOT NULL,
	FOREIGN KEY("CUSTOMERID") REFERENCES "ACCOUNT"("ID"),
	PRIMARY KEY("ID")
);`;
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "RESTOCKORDER" (
      "RESTOCKORDERID"	INTEGER NOT NULL,
      "ISSUEDATE"	TEXT NOT NULL,
      "STATE"	TEXT NOT NULL,
      "ACCOUNTID"	INTEGER NOT NULL,
      "TRANSPORTNOTE"	TEXT,
      FOREIGN KEY("ACCOUNTID") REFERENCES "ACCOUNT"("ID"),
      PRIMARY KEY("RESTOCKORDERID")
    );`;
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "RESTOCKORDER_ITEM" (
      "RESTOCKORDERID"	INTEGER NOT NULL,
      "ITEMID"	INTEGER,
      "QUANTITY"	INTEGER,
      FOREIGN KEY("RESTOCKORDERID") REFERENCES "RESTOCKORDER"("ID"),
      PRIMARY KEY("RESTOCKORDERID","ITEMID"),
      FOREIGN KEY("ITEMID") REFERENCES "ITEM"("ID")
    );`;
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "RETURNORDER" (
      "ID"	INTEGER NOT NULL,
      "RETURNDATE"	TEXT NOT NULL,
      "RESTOCKORDERID"	INTEGER NOT NULL,
      PRIMARY KEY("ID"),
      FOREIGN KEY("RESTOCKORDERID") REFERENCES "RESTOCKORDER"("RESTOCKORDERID")
    );`;
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "RETURNORDER_SKU" (
      "RETURNORDERID"	INTEGER NOT NULL,
      "SKUID"	INTEGER,
      PRIMARY KEY("RETURNORDERID","SKUID"),
      FOREIGN KEY("RETURNORDERID") REFERENCES "RETURNORDER"("ID"),
      FOREIGN KEY("SKUID") REFERENCES "SKU"("ID")
    );`
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "SKUITEM" (
      "RFID"	TEXT NOT NULL,
      "SKUID"	INTEGER NOT NULL,
      "AVAILABLE"	INTEGER NOT NULL,
      "DATEOFSTOCK"	TEXT,
      "INTERNALORDERID"	INTEGER,
      "RESTOCKORDERID"	INTEGER,
      "RETURNORDERID"	INTEGER,
      PRIMARY KEY("RFID"),
      FOREIGN KEY("INTERNALORDERID") REFERENCES "INTERNALORDER"("ID"),
      FOREIGN KEY("SKUID") REFERENCES "SKU"("ID"),
      FOREIGN KEY("RESTOCKORDERID") REFERENCES "RESTOCKORDER"("RESTOCKORDERID"),
      FOREIGN KEY("RETURNORDERID") REFERENCES "RETURNORDER"("ID")
    );`
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "TESTRESULT" (
      "ID"	INTEGER NOT NULL,
      "DATE"	TEXT NOT NULL,
      "RESULT"	INTEGER NOT NULL,
      "TESTDESCRIPTIONID"	INTEGER NOT NULL,
      "RFID"	TEXT,
      PRIMARY KEY("ID"),
      FOREIGN KEY("TESTDESCRIPTIONID") REFERENCES "TESTDESCRIPTOR"("ID"),
      FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID")
    );`
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "TRANSPORTNOTE" (
      "TNID"	INTEGER NOT NULL,
      "SHIPMENTDATE"	TEXT NOT NULL,
      PRIMARY KEY("TNID")
    );`
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });
    sql = `CREATE TABLE IF NOT EXISTS "POSITION" (
      "ID"	TEXT NOT NULL,
      "AISLEID"	TEXT,
      "ROW"	TEXT,
      "COL"	TEXT,
      "MAXWEIGHT"	INTEGER,
      "MAXVOLUME"	INTEGER,
      "OCCUPIEDWEIGHT"	INTEGER,
      "OCCUPIEDVOLUME"	INTEGER,
      "SKUID"	INTEGER,
      PRIMARY KEY("ID")
    );`

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = `CREATE TABLE IF NOT EXISTS "SKU" (
      "ID"	INTEGER NOT NULL,
      "DESCRIPTION"	NUMERIC NOT NULL,
      "WEIGHT"	INTEGER NOT NULL,
      "AVAILABLEQUANTITY"	INTEGER NOT NULL,
      "VOLUME"	NUMERIC NOT NULL,
      "PRICE"	INTEGER NOT NULL,
      "NOTES"	TEXT NOT NULL,
      "POSITIONID"	TEXT,
      PRIMARY KEY("ID"),
      FOREIGN KEY("POSITIONID") REFERENCES "POSITION"("ID")
    );`
    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });
    resolve(true);
    console.log("Database created");
  });
}

async function prepareDatabase() {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (1,'John','Smith','customer','user1@ezwh.com','testpassword');`;
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });

    sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (2,'Frank','Paul','qualityEmployee','qualityEmployee1@ezwh.com','testpassword');`;

    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });

    sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (3,'Michael','Red','clerk','clerk1@ezwh.com','testpassword');`;

    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });

    sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (4,'John','Blue','deliveryEmployee','deliveryEmployee1@ezwh.com','testpassword');`;
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });

    sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (5,'Matt','Demon','supplier','supplier1@ezwh.com','testpassword');`;
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });

    sql = `INSERT INTO "ACCOUNT" ("ID","NAME","SURNAME","ACCESSRIGHT","EMAIL","PASSWORD") VALUES (6,'Luke','Green','manager','manager1@ezwh.com','testpassword');`;
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      }
    });
    console.log("Users created")
    resolve();
  });
}

async function handleDB() {
  await createTable();
  
  await prepareDatabase();
}

module.exports = app;