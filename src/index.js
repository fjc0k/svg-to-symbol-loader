const path = require('path')
const SVGO = require('svgo')
const defaultSVGOOptions = require('./defaultSVGOOptions')

module.exports = function (SVGContent) {
  this.cacheable && this.cacheable()

  const done = this.async()

  const {
    extractId = ({ name }) => name,
    svgo: SVGOptions = defaultSVGOOptions
  } = this.query || {}

  const svgo = new SVGO({ plugins: [SVGOptions] })

  const { name } = path.parse(this.resourcePath)

  const id = typeof extractId === 'function' ? extractId.call(this, { name }) : name

  svgo.optimize(SVGContent).then(({ data }) => {
    data = data.trim().replace(
      /^<svg\s*([^>]*)>(.*)<\/svg>$/i,
      (_, attrs, content) => {
        attrs = attrs.replace(/id=\S+/i, '')
        return `<symbol id="${id}"${attrs ? ' ' + attrs : ''}>${content}</symbol>`
      }
    )
    done(null, `module.exports = ${JSON.stringify(data)}`)
  })
}
