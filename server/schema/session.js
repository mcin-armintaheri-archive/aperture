const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    session: Session
  }

  type Session {
    user: User
  }
`;

const resolvers = {
  Query: {
    async session(_, __, context) {
      if (
        context.session.passport &&
        context.session.passport.user &&
        context.session.passport.user.orcid
      ) {
        const userSet = await (await context.storage.root()).get(
          context.session.passport.user.orcid
        );

        return { user: { id: userSet.id } };
      }
    }
  }
};

module.exports = { typeDefs, resolvers };
