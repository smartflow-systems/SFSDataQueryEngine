class StubDatabase {
  constructor(filename, callback) {
    this.filename = filename;
    this._data = new Map();
    if (typeof callback === "function") {
      setImmediate(() => callback(null));
    }
  }

  all(_sql, _params, callback) {
    if (typeof callback === "function") {
      callback(null, []);
    }
  }

  run(_sql, _params, callback) {
    if (typeof callback === "function") {
      callback.call({ changes: 0 }, null);
    }
  }

  get(_sql, _params, callback) {
    if (typeof callback === "function") {
      callback(null, { test: 1 });
    }
  }

  close(callback) {
    if (typeof callback === "function") {
      callback(null);
    }
  }
}

function verbose() {
  return { Database: StubDatabase };
}

const sqlite3 = { Database: StubDatabase, verbose };

export { StubDatabase as Database, verbose };
export default sqlite3;
