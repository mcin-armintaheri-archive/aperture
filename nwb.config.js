const path = require("path");

require("dotenv").config();

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "Aperture",
      externals: {
        react: "React"
      }
    }
  },
  webpack: {
    aliases: {
      src: path.resolve("src")
    }
  },
  devServer: {
    proxy: {
      "/graphql": {
        target: `http://localhost:${process.env.PORT}`
      }
    }
  }
};
