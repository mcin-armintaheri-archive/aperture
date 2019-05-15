const fs = require("fs");
const path = require("path");
const levelup = require("levelup");
const leveldown = require("leveldown");
const exitHook = require("exit-hook");

const PersistedSet = require("./persisted-set");

module.exports = class ObjectStorage {
  constructor(location, namespace = "ROOT") {
    const dbpath = path.dirname(location);

    try {
      if (!fs.existsSync(dbpath)) {
        fs.mkdirSync(dbpath, { recursive: true });
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
      throw new Error(`Cannot create a database at: ${location}`);
    }

    const db = levelup(leveldown(location));

    (async () => {
      try {
        await db.get(namespace);
      } catch (_) {
        await db.put(namespace, JSON.stringify({ __storedType: "SET" }));
      }
    })();

    this.unsubExitHook = exitHook(() => db.close());

    this.db = db;

    this.namespace = namespace;
  }

  async close() {
    this.unsubExitHook();

    return this.db.close(err => {
      if (err) throw err;
    });
  }

  async root(id = this.namespace) {
    if (!(typeof id === "string") || id.length === 0) {
      throw new Error("Invalid ID. Please use a non-empty string.");
    }

    await this.db.get(id);

    return new PersistedSet(id, this);
  }
};
