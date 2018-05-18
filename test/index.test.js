const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const resolve = path.resolve.bind(path, __dirname)

test('basic', done => {
  webpack({
    mode: 'development',
    entry: {
      sprite: resolve('sprite.js')
    },
    output: {
      path: resolve('dist')
    },
    module: {
      rules: [{
        test: /\.svg$/,
        use: resolve('../src/index.js')
      }]
    }
  }, err => {
    expect(err).toBe(null)
    const spriteJs = fs.readFileSync(resolve('dist/sprite.js')).toString()
    const sprite = eval(spriteJs) // eslint-disable-line
    expect(sprite).toBe('<svg><defs><symbol id="add">add</symbol><symbol id="close">close</symbol></defs></svg>')
    done()
  })
})

test('extractId', done => {
  webpack({
    mode: 'development',
    entry: {
      sprite: resolve('sprite.js')
    },
    output: {
      path: resolve('dist')
    },
    module: {
      rules: [{
        test: /\.svg$/,
        use: [{
          loader: resolve('../src/index.js'),
          options: {
            extractId({ name }) {
              return `icon-${name}`
            }
          }
        }]
      }]
    }
  }, err => {
    expect(err).toBe(null)
    const spriteJs = fs.readFileSync(resolve('dist/sprite.js')).toString()
    const sprite = eval(spriteJs) // eslint-disable-line
    expect(sprite).toBe('<svg><defs><symbol id="icon-add">add</symbol><symbol id="icon-close">close</symbol></defs></svg>')
    done()
  })
})
