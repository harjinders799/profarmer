import { deleteDatabase, enablePromise, openDatabase } from "react-native-sqlite-storage";
import { COTTON_PRICE_TABLE, PCIKER_TABLE, PICKER_EXPENSE_TABLE, } from "./tabels";

enablePromise(true);

export const getDBConnectionDB = async () => {
    return openDatabase({ name: "profarmer.db", location: "default" });
};
export const deleteDBConnectionDB = async () => {
    return deleteDatabase("profarmer.db");
};

export const createPickerTable = async (db) => {
    const query = `CREATE TABLE IF NOT EXISTS ${PCIKER_TABLE}(
        id INTEGER PRIMARY KEY,
        fid TEXT,
        uid TEXT,
        rate TEXT,
        picker TEXT,
        weight TEXT,
        detail TEXT,
        date INTEGER,
        sync TEXT
    )`;
    await db.executeSql(query);
};


export const savePickerData = async (db, items) => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${PCIKER_TABLE}(id, fid, uid, rate, picker, weight, detail, date, sync) values` +
        items
            .map(
                (i) =>
                    `(${i?.id}, '${i?.fid}', '${i?.uid}', '${i?.rate}', '${i?.picker}', '${i?.weight}', '${i?.detail}', ${i?.date},'${i?.sync ? i?.sync : 'pending'}')`
            )
            .join(",");
    return db.executeSql(insertQuery);
};

export const updatePickerData = async (db, i) => {
    const updateQuery = `UPDATE ${PCIKER_TABLE} SET  fid = '${i?.fid}', rate = '${i?.rate}', weight = '${i?.weight}', detail = '${i?.detail}', date = ${i?.date}, sync = '${i?.sync ? i?.sync : 'pending'}' WHERE uid = '${i?.uid}' AND id=${i?.id};`;
    return db.executeSql(updateQuery);
};

export const updatePickerId = async (db, i) => {
    const updateQuery = `UPDATE ${PCIKER_TABLE} SET  fid = '${i?.fid}', sync = 'done' WHERE uid = '${i?.uid}' AND id=${i?.id};`;
    return db.executeSql(updateQuery);
};

export const deletePickerData = async (db, i) => {
    const deleteQuery = `DELETE from ${PCIKER_TABLE} where picker = '${i?.picker}' AND uid='${i?.uid}' AND id =${i?.id}`;
    await db.executeSql(deleteQuery);
};

export const createPickerExpenseTable = async (db) => {
    const query = `CREATE TABLE IF NOT EXISTS ${PICKER_EXPENSE_TABLE}(
        id INTEGER PRIMARY KEY,
        fid TEXT,
        uid TEXT,
        amount TEXT,
        picker TEXT,
        detail TEXT,
        date INTEGER,
        sync TEXT
    )`;
    await db.executeSql(query);
};

export const savePickerExpenseData = async (db, items) => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${PICKER_EXPENSE_TABLE}(id, fid, uid, amount, picker, detail, date, sync) values` +
        items
            .map(
                (i) =>
                    `('${i?.id}', '${i?.fid}', '${i?.uid}', '${i?.amount}', '${i?.picker}', '${i?.detail}', ${i?.date},'${i?.sync ? i?.sync : 'pending'}')`
            )
            .join(",");
    return db.executeSql(insertQuery);
};


export const updatePickerExpenseData = async (db, i) => {
    const updateQuery = `UPDATE ${PICKER_EXPENSE_TABLE} SET  fid = '${i?.fid}', amount = '${i?.amount}', detail = '${i?.detail}', date = ${i?.date}, sync = '${i?.sync ? i?.sync : 'pending'}' WHERE uid = '${i?.uid}' AND id=${i?.id};`;
    return db.executeSql(updateQuery);
};

export const updatePickerExpenseId = async (db, i) => {
    const updateQuery = `UPDATE ${PICKER_EXPENSE_TABLE} SET  fid = '${i?.fid}', sync = 'done' WHERE uid = '${i?.uid}' AND id=${i?.id};`;
    return db.executeSql(updateQuery);
};

export const deletePickerExpenseData = async (db, i) => {
    const deleteQuery = `DELETE from ${PICKER_EXPENSE_TABLE} where picker = '${i?.picker}' AND uid='${i?.uid}' AND id =${i?.id}`;
    await db.executeSql(deleteQuery);
};

export const createCottonPriceTable = async (db) => {
    const query = `CREATE TABLE IF NOT EXISTS ${COTTON_PRICE_TABLE}(
        market TEXT PRIMARY KEY,
        maxPrice TEXT,
        minPrice TEXT,
        district TEXT,
        arrivalDate TEXT
    )`;
    await db.executeSql(query);
};

export const saveCottonPriceData = async (db, items) => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${COTTON_PRICE_TABLE}( market, maxPrice, minPrice, district, arrivalDate ) values` +
        items
            .map(
                (i) =>
                    `('${i?.market}', '${i?.maxPrice}', '${i?.minPrice}', '${i?.district}', '${i?.arrivalDate}')`
            )
            .join(",");
    return db.executeSql(insertQuery);
};


export const getAllItems = async (db, tableName, params = '') => {
    try {
        const items = [];
        const results = await db.executeSql(
            `SELECT * FROM ${tableName}  ${params}`,
        );
        results.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                items.push(result.rows.item(index));
            }
        });
        return items;
    } catch (error) {
        console.error(error);
        throw Error("Failed to get Items !!!");
    }
};