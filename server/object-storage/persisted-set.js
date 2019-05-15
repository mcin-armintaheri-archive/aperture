const uuid = require("uuid/v4");

module.exports = class PersistedSet {
  constructor(id, storage) {
    if (!(typeof id === "string") || id.length === 0) {
      throw new Error("Invalid ID. Please use a non-empty string.");
    }

    this.id = id;

    this.storage = storage;
  }

  iterator(options = {}) {
    const self = this;

    const iterator = self.storage.db.iterator({ gt: self.id, ...options });

    const next = async () =>
      new Promise((resolve, reject) => {
        iterator.next((err, k, v) =>
          err
            ? reject(err)
            : resolve({
                key: k && k.toString(),
                value: v && JSON.parse(v.toString()).content,
                __storedType: v && JSON.parse(v.toString()).__storedType
              })
        );
      });

    const end = async () =>
      new Promise((resolve, reject) =>
        iterator.end(err => (err ? reject(err) : resolve()))
      );

    const createGenerator = async function*() {
      let data = null;

      try {
        for (;;) {
          data = await next();

          if (!data || !data.key || !data.key.startsWith(self.id)) {
            return;
          }

          yield data;
        }
      } finally {
        await end();
      }
    };

    return createGenerator();
  }

  async size() {
    let count = 0;

    for await (const element of this.iterator()) {
      element;
      count++;
    }

    return count;
  }

  async all() {
    let list = [];

    for await (const { value } of this.iterator()) {
      list.push(value);
    }

    return list;
  }

  async find(id) {
    let found = null;

    for await (const { value, __storedType } of this.iterator()) {
      if (__storedType === "REFERENCE" && id && value.id && value.id === id) {
        found = await this.storage.root(value.id);
        break;
      }
    }

    return found;
  }

  async get(id, ref = false) {
    const fullID = `${this.id}:${id}`;

    const res = await this.storage.db.get(fullID);

    const value = res && JSON.parse(res.toString()).content;

    if (ref) {
      return this.storage.root(value.id);
    }

    return value;
  }

  async create(key = null) {
    const id = await this.generateID();

    await this.storage.db.put(id, JSON.stringify({ __storedType: "SET" }));

    if (key) {
      return this.set(key, id, true);
    }

    return this.add(id, true);
  }

  async add(value, ref = false) {
    const pointerID = await this.generateID();

    return this.set(pointerID, value, ref);
  }

  async set(id, value, ref = false) {
    const fullID = `${this.id}:${id}`;

    if (ref) {
      await this.storage.db.put(
        fullID,
        JSON.stringify({ __storedType: "REFERENCE", content: { id: value } })
      );

      return this.storage.root(value);
    }

    await this.storage.db.put(
      fullID,
      JSON.stringify({ __storedType: "VALUE", content: value })
    );

    return this;
  }

  async remove(id = null) {
    if (id === null) {
      const ops = [{ type: "del", key: id }];

      for await (const { key } of this.iterator()) {
        ops.push({ type: "del", key });
      }

      return this.storage.db.batch(ops);
    }

    return this.storage.db.del(`${this.id}:${id}`);
  }

  async generateID() {
    let id = null;

    for (;;) {
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
