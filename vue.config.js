module.exports = {
    outputDir:process.env.outputDir,
    productionSourceMap:false,
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
            entry:'./src/pages/pp_quality/main.js',
            template: './src/pages/pp_quality/index.html',
            filename:'pp_quality_report.html'
    },
    pp_localDev: {
      entry: './src/pages/pp_localDev/main.js',
      template: './src/pages/pp_localDev/index.html',
      filename: 'pp_local_development.html'
        }
    }
}
