module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Aperture',
      externals: {
        react: 'React'
      }
    }
  }
}
