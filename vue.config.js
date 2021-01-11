module.exports = {
  outputDir: process.env.outputDir,
  productionSourceMap: false,
  filenameHashing: false,
  pages: {
    pph_allUser: {
      entry: './src/pages/pph_allUser/main.js',
      template: './src/pages/pph_allUser/index.html',
      filename: 'pph_allUser.html'
    },
    pph_interaction: {
      entry: './src/pages/pph_interaction/main.js',
      template: './src/pages/pph_interaction/index.html',
      filename: 'pph_interaction.html'
    },
    pp_quality: {
      entry: './src/pages/pp_quality/main.js',
      template: './src/pages/pp_quality/index.html',
      filename: 'pp_quality_report.html'
    },
    pp_localDev: {
      entry: './src/pages/pp_localDev/main.js',
      template: './src/pages/pp_localDev/index.html',
      filename: 'pp_local_development.html'
    },
    www_dt_detail: {
      entry: './src/pages/daily_tones/main.js',
      template: './src/pages/daily_tones/index.html',
      filename: 'www_dt_detail.html'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 30000 }))
  }
}
