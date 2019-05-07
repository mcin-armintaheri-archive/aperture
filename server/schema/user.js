const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Mutation {
    signup(form: SignupForm): Boolean
  }

  input SignupForm {
    username: String
    email: String
    password: String
  }

  type User implements Record {
    id: ID!
    read: User
    username: String!
    email: String!
  }
`;

const resolvers = {
  Mutation: {
    async signup(_, { form }, context) {
      const userSet = await context.storage.create();

      // TODO: store password hashes
      await userSet.set("username", form.username);

      const root = await context.storage.root();

      await root.add(userSet.id, true);

      return;
    }
  }
};

module.exports = { typeDefs, resolvers };
