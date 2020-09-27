module.exports = {
    staticFileGlobs: [
        'app/css/**.css',
        'app/**.html',
        'app/images/**.*',
        'app/js/**.js'
    ],
    stripPrefix: 'app/',
    runtimeCaching: [{
        urlPattern: /this\\.is\\.a\\.regex/,
        handler: 'networkFirst'
    }]
};
