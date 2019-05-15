const path = require("path");

module.exports = {
  env: { es6: true, browser: true, node: true },
  parser: "babel-eslint",
  plugins: ["prettier", "react"],
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  settings: {
    "import/resolver": {
      "babel-module": {
        alias: {
          src: path.resolve("src")
        }
      }
    }
  }
};
