const R = require("ramda");
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
    username: String!
    email: String!
    submissions: SubmissionFeed
  }
`;

const resolvers = {
  Mutation: {
    async signup(_, { form }, context) {
      const userSet = await context.storage.create();

      // TODO: store password hashes
      await userSet.set("username", form.username);

      await context.storage.root().add(userSet.id, true);

      return;
    }
  }
};

module.exports = { typeDefs, resolvers };
