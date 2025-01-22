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
                resolve(result.result);
            }
        }
    });

    const result = await request;

    return result;
}

const DB_NAME = "FinWeb";
const DB_VERSION = 1;