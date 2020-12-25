const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')
const withCss = require('@zeit/next-css')
const withSass = require("@zeit/next-sass");

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd.custom.less'), 'utf8')
)

module.exports = withCss({
  cssModules: true,
  ...withLess(withSass({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables
    },
    webpack: (config, {isServer, dev}) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ]

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        })
      }
      config.resolve.alias['@'] = path.resolve(__dirname)
      return config
    }
  }))
})
