module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.html$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
