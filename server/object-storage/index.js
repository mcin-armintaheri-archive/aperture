const fs = require("fs");
const path = require("path");
const uuid = require("uuid/v4");
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

    this.unsubExitHook = exitHook(() => db.close());

    this.db = db;

    this.namespace = namespace;
  }

  async close() {
    this.unsubExitHook();

    return this.db.close();
  }

  async create() {
    const id = await this.generateID();

    return this.root(id);
  }

  async root(id = this.namespace) {
    if (!(typeof id === "string") || id.length === 0) {
      throw new Error("Invalid ID. Please use a non-empty string.");
    }

    try {
      await this.db.get(id);
    } catch (_) {
      await this.db.put(id, JSON.stringify({ __storedType: "SET" }));
    }

    return new PersistedSet(id, this);
  }

  async generateID() {
    let id = null;

    while (true) {
      id = uuid();

      try {
        await this.db.get(id);
      } catch (_) {
        break;
      }
    }

    return id;
  }
};
