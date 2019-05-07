const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

const base = require("./base");
const table = require("./table");
const user = require("./user");
const session = require("./session");

const typeDefs = gql`
  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    base.typeDefs,
    table.typeDefs,
    user.typeDefs,
    session.typeDefs
  ],
  resolvers: [
    resolvers,
    base.resolvers,
    table.resolvers,
    user.resolvers,
    session.resolvers
  ],
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  inheritResolversFromInterfaces: true
});

module.exports = schema;
