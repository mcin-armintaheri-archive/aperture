const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Mutation {
    remove(id: ID!, key: String): Boolean
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ListParameters {
    page: Int
    limit: Int
    stortBy: String
    order: SortOrder
  }

  interface Feed {
    id: ID!
    size: Int!
    all(options: ListParameters): [Record]!
    find(id: ID!): Record
  }

  interface Record {
    id: ID!
    read: Record
  }
`;

const resolvers = {
  Mutation: {
    async remove(_, { id, key }, context) {
      (await context.root(id)).remove(key);
    }
  },
  Record: {
    async read(obj, _, context) {
      async function resolver(obj, _, context) {
        const set = await context.storage.root(obj.id);

        const record = { id: obj.id, read: resolver };

        for await (const element of set.iterator()) {
          const field = element.key.match(/.*:(.*)/)[1];

          record[field] = element.value;
        }

        return record;
      }

      return resolver(obj, _, context);
    }
  },
  Feed: {
    async size(obj, _, context) {
      return (await context.storage.root(obj.id)).size();
    },
    async all(obj, { options }, context) {
      return (await context.storage.root(obj.id)).all(options);
    },
    async find(obj, { id }, context) {
      return (await context.storage.root(obj.id)).find(id);
    }
  }
};

module.exports = { typeDefs, resolvers };
