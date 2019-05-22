const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const { GraphQLUpload } = require("graphql-upload");

const base = require("./base");
const user = require("./user");
const session = require("./session");
const submission = require("./submission");

const typeDefs = gql`
  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }

  scalar Upload
`;

const resolvers = {
  Upload: GraphQLUpload
};

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    base.typeDefs,
    user.typeDefs,
    session.typeDefs,
    submission.typeDefs
  ],
  resolvers: [
    resolvers,
    base.resolvers,
    user.resolvers,
    session.resolvers,
    submission.resolvers
  ],
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  inheritResolversFromInterfaces: true
});

module.exports = schema;
