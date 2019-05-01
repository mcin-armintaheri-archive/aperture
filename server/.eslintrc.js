const path = require("path");

module.exports = {
  plugins: ["prettier", "node"],
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"]
};
