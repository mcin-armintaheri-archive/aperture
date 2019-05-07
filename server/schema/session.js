const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    session: Session
  }

  extend type Mutation {
    login(form: LoginForm): Session
    logout: Boolean
  }

  input LoginForm {
    username: String
    password: String
  }

  type Session {
    user: User
  }
`;

const resolvers = {
  Query: {
    session(_, __, context) {
      if (context.session.userID) {
        return { user: { id: context.session.userID } };
      }
    }
  },
  Mutation: {
    async login(_, { form }, context) {
      const set = await context.storage.root();

      let match = null;
      for await (const { value } of set.iterator()) {
        const userSet = await context.storage.root(value.id);

        const username = await userSet.get("username");

        // TODO: lookup password hashes
        if (form.username === username) {
          match = value;
          context.session.userID = value.id;

          break;
        }
      }

      return { user: match };
    },
    async logout(_, __, context) {
      delete context.session.userID;
    }
  }
};

module.exports = { typeDefs, resolvers };
