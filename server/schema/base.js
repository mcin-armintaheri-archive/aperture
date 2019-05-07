const { gql } = require("apollo-server");

const typeDefs = gql`
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
  Record: {
    async read(obj, _, context) {
      async function resolver(obj, _, context) {
        const set = context.storage.root(obj.id);

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
      return context.storage.root.size();
    },
    async all(obj, { options }, context) {
      return context.storage.root(obj.id).all(options);
    },
    async find(obj, { id }, context) {
      return context.storage.root(obj.id).get(id);
    }
  }
};

module.exports = { typeDefs, resolvers };
