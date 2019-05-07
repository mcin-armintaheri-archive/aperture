const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");

const schema = require("./schema");
const ObjectStorage = require("./object-storage");

require("dotenv").config();

const app = express();

app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = new ObjectStorage(process.env.DB_LOCATION);

const graphqlServer = new ApolloServer({
  schema,
  context({ req }) {
    return { session: req.session, storage };
  }
});

graphqlServer.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready on port ${process.env.PORT}`); // eslint-disable-line no-console
});
