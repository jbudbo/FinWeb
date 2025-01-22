export function initialize() {
    const finDb = indexedDB.open(DB_NAME, DB_VERSION);
    finDb.onupgradeneeded = function () {
        const db = finDb.result;
        db.createObjectStore("accounts", { keyPath: "name" });
    }
}

export function set(store, value) {
    const finDb = indexedDB.open(DB_NAME, DB_VERSION);
    finDb.onsuccess = function () {
        const transaction = finDb.result.transaction(store, "readwrite");
        const collection = transaction.objectStore(store);
        collection.put(value);
    }
}

export async function get(store, id) {
    const request = new Promise((resolve) => {
        const finDb = indexedDB.open(DB_NAME, DB_VERSION);
        finDb.onsuccess = function () {
            const transaction = finDb.result.transaction(store, "readonly");
            const collection = transaction.objectStore(store);
            const result = collection.get(id);

            result.onsuccess = function (e) {
                resolve(e.target.result);
            }
        }
    });

    const result = await request;

    return result;
}

export async function keys(store) {
    const request = new Promise((resolve) => {
        const finDb = indexedDB.open(DB_NAME, DB_VERSION);
        finDb.onsuccess = function () {
            const transaction = finDb.result.transaction(store, "readonly");
            const collection = transaction.objectStore(store);
            const result = collection.getAllKeys();

            result.onsuccess = function (e) {
                resolve(e.target.result);
            }
        }
    });

    const result = await request;

    return result;
}

export async function getAccounts() {
    const request = new Promise((resolve) => {
        const finDb = indexedDB.open(DB_NAME, DB_VERSION);
        finDb.onsuccess = function (e) {
            const transaction = e.target.result.transaction("accounts", "readonly");
            const collection = transaction.objectStore("accounts");
            const result = collection.openCursor();

            const accounts = [];
            result.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    accounts.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(accounts);
                }
            }
        }
    });

    const result = await request;

    return result;
}

const DB_NAME = "FinWeb";
const DB_VERSION = 1;