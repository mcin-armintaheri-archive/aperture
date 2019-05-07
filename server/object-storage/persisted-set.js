const R = require("ramda");

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
                value: v && JSON.parse(v.toString()).content
              })
        );
      });

    const end = async () =>
      new Promise((resolve, reject) =>
        iterator.end(err => (err ? reject(err) : resolve()))
      );

    const createGenerator = async function*() {
      let data = null;

      while (true) {
        data = await next();

        if (!data || !data.key || !data.key.startsWith(self.id)) {
          await end();

          return;
        }

        yield data;
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

  async get(id) {
    const fullID = `${this.id}:${id}`;

    const res = await this.storage.db.get(fullID);

    return res && res.value && JSON.parse(res.value.toString()).content;
  }

  async add(value, ref = false) {
    const pointerID = await this.storage.generateID();

    return this.set(pointerID, value, ref);
  }

  async set(id, value, ref = false) {
    const fullID = `${this.id}:${id}`;

    if (ref) {
      await this.storage.db.put(
        fullID,
        JSON.stringify({ __storedType: "REFERENCE", content: { id: value } })
      );

      return new PersistedSet(id, this.storage);
    }

    await this.storage.db.put(
      fullID,
      JSON.stringify({ __storedType: "VALUE", content: value })
    );

    return this;
  }

  async remove(id = null) {
    if (id === null) {
      const ops = [{ type: 'del', key: id }];

      for await (const { key } of this.iterator()) {
        ops.push({ type: "del", key });
      }

      return this.storage.db.batch(ops);
    }

    return this.storage.db.del(`${this.id}:${id}`);
  }
};
