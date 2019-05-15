const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Mutation {
    signup(form: SignupForm): Boolean
  }

  input SignupForm {
    username: String!
    password: String!
    name: String!
    affiliations: [String]!
    email: String!
  }

  type User implements Record {
    id: ID!
    read: User
    username: String!
    name: String!
    affiliations: [String]!
    email: String!
    submissions: SubmissionFeed!
  }
`;

const resolvers = {
  Mutation: {
    async signup(_, { form }, context) {
      const userSet = await (await context.storage.root()).create();

      // TODO: store password hashes
      await userSet.set("username", form.username);
      await userSet.set("name", form.name);
      await userSet.set("affiliations", form.affiliations);
      await userSet.set("email", form.email);
      await userSet.create("submissions");
    }
  }
};

module.exports = { typeDefs, resolvers };
