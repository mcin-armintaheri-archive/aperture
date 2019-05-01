const path = require("path");

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
  }
};
