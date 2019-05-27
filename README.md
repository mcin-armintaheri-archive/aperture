# aperture

# Deployment:

First copy `env.template` to `.env` and edit the environment variables accordingly.
By default, the ORCID sandbox API is used for authentication.
Please create and copy the client ID and client secret to the `.env` file.

For more information visit [https://orcid.org/](https://orcid.org/) or [https://sandbox.orcid.org/](https://sandbox.orcid.org/).

```
npm install
npm run build
npm run server
```

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

