const { gql } = require("apollo-server");

const typeDefs = gql`
  type TableColumn {
    key: String
    label: String
  }

  interface Table {
    header: [TableColumn]
    rows: Feed
  }
`;

const resolvers = {};

module.exports = { typeDefs, resolvers };
