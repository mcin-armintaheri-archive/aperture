const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    session: Session
  }

  extend type Mutation {
    login(form: LoginForm): Session
    logout(): Boolean
  }

  input LoginForm {
    username: String
    password: String
  }

  type Session  {
    user: User
  }
`;

const resolvers = {
  Query: {
    session(_, __, context) {
      if (context.session.id) {
        return { user: { id: context.session.id } };
      }
    }
  },
  Mutation: {
    async login(_, { form }, context) {
      const set = context.storage.root();

      let match = null;
      for await (const { value } of set.iterator()) {
        // TODO: lookup password hashes
        if (form.username === value.username) {
          match = value;
          context.session.id = value.id;

          break;
        }
      }

      return { user: match };
    },
    async logout(_, __, context) {
      delete context.session.id;
    }
  }
};

module.exports = { typeDefs, resolvers };
