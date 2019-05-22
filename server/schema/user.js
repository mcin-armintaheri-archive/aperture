const { gql } = require("apollo-server");

const typeDefs = gql`
  type User implements Record {
    id: ID!
    read: User
    submissions: SubmissionFeed!
  }
`;

const resolvers = {};

module.exports = { typeDefs, resolvers };
