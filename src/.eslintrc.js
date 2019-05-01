const path = require("path");

module.exports = {
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
