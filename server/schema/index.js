const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

const base = require("./base");

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
  typeDefs: [typeDefs, base.typeDefs],
  resolvers: [resolvers, base.resolvers],
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  inheritResolversFromInterfaces: true
});

module.exports = schema;
