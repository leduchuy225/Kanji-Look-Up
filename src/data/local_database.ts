import { TransactionOptions } from "../models/interface";
import { DB_NAME, DB_VERSION, KanjiTable } from "../config/config";

let database: IDBDatabase | null = null;

export function createDatabase(onConnectSuccess: () => void) {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    database = target.result;
    onConnectSuccess();
  };

  request.onerror = function (event) {
    console.log("Problem opening DB.");
  };

  request.onupgradeneeded = function (event) {
    const target = event.target as IDBOpenDBRequest;
    database = target.result;
    const objectStore = target.result.createObjectStore(KanjiTable.name, {
      keyPath: KanjiTable.key,
    });
    objectStore.transaction.oncomplete = function (event) {
      console.log("ObjectStore Created.");
    };
  };
}

export function insertRecords<T>(records: T[], options: TransactionOptions) {
  if (!database) {
    return;
  }
  const insert_transaction = database.transaction(
    options.name ?? options.tableName,
    "readwrite"
  );
  const objectStore = insert_transaction.objectStore(options.tableName);

  return new Promise((resolve, reject) => {
    insert_transaction.oncomplete = function () {
      console.log("ALL INSERT TRANSACTIONS COMPLETE.");
      resolve(true);
    };
    insert_transaction.onerror = function () {
      console.log("PROBLEM INSERTING RECORDS.");
      resolve(false);
    };
    records.forEach((data) => {
      const request = objectStore.add(data);
      request.onsuccess = function () {
        console.log("Added: ", data);
      };
    });
  });
}

export function getRecord<T>(
  key: string,
  options: TransactionOptions
): Promise<T | null> | null {
  if (!database) {
    return null;
  }
  const get_transaction = database.transaction(
    options.name ?? options.tableName,
    "readonly"
  );
  const objectStore = get_transaction.objectStore(options.tableName);
  return new Promise((resolve, reject) => {
    get_transaction.oncomplete = function () {
      console.log("ALL GET TRANSACTIONS COMPLETE.");
    };
    get_transaction.onerror = function () {
      console.log("PROBLEM GETTING RECORDS.");
    };

    const request = objectStore.get(key);
    request.onsuccess = function (event) {
      const target = event.target as IDBRequest<T>;
      resolve(target.result);
    };
  });
}

export function getManyRecord<T>(keys: string[], options: TransactionOptions) {
  if (!database) {
    return null;
  }
  return Promise.all(keys.map((key) => getRecord<T>(key, options)));
}

export function clearTable(options: TransactionOptions) {
  if (!database) {
    return null;
  }
  const clear_transaction = database.transaction(
    options.name ?? options.tableName,
    "readwrite"
  );
  const objectStore = clear_transaction.objectStore(options.tableName);
  return new Promise((resolve, reject) => {
    clear_transaction.oncomplete = function () {
      console.log("CLEAR ALL RECORDS COMPLETE.");
    };
    clear_transaction.onerror = function () {
      console.log("PROBLEM CLEARING RECORDS.");
    };

    const request = objectStore.clear();
    request.onsuccess = function (event) {
      resolve(true);
    };
  });
}
