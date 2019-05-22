const express = require("express");
const session = require("express-session");
const passport = require("passport");
var OrcidStrategy = require("passport-orcid").Strategy;
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");

const schema = require("./schema");
const ObjectStorage = require("./object-storage");

require("dotenv").config();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const storage = new ObjectStorage(process.env.DB_LOCATION);

// add the ORCID authentication strategy
passport.use(
  new OrcidStrategy(
    {
      sandbox:
        process.env.USE_ORCID_SANDBOX && process.env.USE_ORCID_SANDBOX !== "0",
      state: true,
      clientID: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
      callbackURL: "/auth/orcid/callback"
    },
    function(accessToken, refreshToken, params, profile, done) {
      // `profile` is empty as ORCID has no generic profile URL,
      // so populate the profile object from the params instead

      profile = {
        orcid: params.orcid,
        name: params.name,
        accessToken
      };

      if (!params.orcid) {
        throw new Error("ORCID ID was not found in the ORCID profile.");
      }

      const key = `${params.orcid}`;

      (async () => {
        try {
          storage.root().get(key);
        } catch (_) {
          const userSet = await (await storage.root()).create(key);

          await userSet.set("name", `${params.name}`);
          await userSet.create("submissions");
        }
      })();

      return done(null, profile);
    }
  )
);

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(`${__dirname}/../demo/dist`));

app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const graphqlServer = new ApolloServer({
  schema,
  context({ req }) {
    return {
      session: req.session,
      storage
    };
  }
});

graphqlServer.applyMiddleware({ app });

// start authenticating with ORCID
app.get("/auth/orcid/login", passport.authenticate("orcid"));
app.get(
  "/auth/orcid/callback",
  passport.authenticate("orcid", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

// sign out
app.get("/auth/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready on port ${process.env.PORT}`); // eslint-disable-line no-console
});
