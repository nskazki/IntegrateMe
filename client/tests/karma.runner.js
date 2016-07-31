'use strict'

const exists = require('fs').existsSync
const rawReadFile = require('fs').readFileSync
const mkdirp = require('mkdirp').sync
const inspect = require('util').inspect
const resolve = require('path').resolve
const cheerio = require('cheerio')
const toArray = require('lodash').toArray
const flatten = require('lodash').flatten
const difference = require('lodash').difference
const supportsColor = require('supports-color')

const debug = require('debug')('tests/karma.conf')
const readFile = p => rawReadFile(p, 'utf8')
const dirResolve = p => resolve(__dirname, p)

function resolveScripts(rawScripts, resolver, debugName) {
  const scriptsAll = rawScripts.map(resolver)
  const scripts = scriptsAll.filter(script => exists(script))
  const scriptsNF = difference(scriptsAll, scripts)

  debug(`${debugName}: ${scripts.length}`)
  if (scriptsNF.length)
    console.warn(`not found ${scriptsNF.length}/${scriptsAll.length}`
               + `of ${debugName}: ${inspect(scriptsNF)}`)

  return scripts
}

// mainConfig
const mainConfig = require('./config')
const appResolve = p => resolve(__dirname, mainConfig.appBase, p)

// coverage dir
const coverageDir = dirResolve(mainConfig.coverageDir)
if (!exists(coverageDir)) mkdirp(coverageDir)
debug(`coverageDir: ${coverageDir}`)

// preAppScripts
const preAppScripts = resolveScripts(
  mainConfig.preAppScripts,
  dirResolve,
  'preAppScripts')

// appScripts
const appIndexPath = appResolve(mainConfig.appIndex)
const appIndexText = readFile(appIndexPath)
const appScriptTags = toArray(cheerio.load(appIndexText)('script'))

const appScripts = resolveScripts(
  appScriptTags.map(tag => tag.attribs.src),
  appResolve,
  'appScripts')

// libScripts
const karmaScripts = resolveScripts(
  mainConfig.karmaScripts,
  dirResolve,
  'karmaScripts')

// mockScripts
const mockScripts = resolveScripts(
  mainConfig.mockScripts,
  dirResolve,
  'mockScripts')

// specScripts
const specScripts = resolveScripts(
  mainConfig.specScripts,
  dirResolve,
  'specScripts')

// all scripts
const allScripts = flatten([
  preAppScripts, appScripts,
  karmaScripts, mockScripts, specScripts ])

// exports
module.exports = function(config) {
  // http://karma-runner.github.io/0.13/config/configuration-file.html
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: mainConfig.appBase,
    // list of files / patterns to load in the browser
    files: allScripts.concat('**/*.html'),
    // list of files to exclude
    exclude: [],
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Hostname to be used when capturing browsers.
    hostname: mainConfig.hostname,
    // web server port
    port: mainConfig.port,


    client: {
      // Capture all console output and pipe it to the terminal.
      captureConsole: mainConfig.pipeConsole || !!process.env.DEBUG
    },

    // test frameworks
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha' ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.js': ['coverage'],
      '**/*.html': ['ng-html2js']
    },

    // setup Karma to serve our templates.
    // https://github.com/Puigcerber/angular-unit-testing#templates
    ngHtml2JsPreprocessor: {
      stripPrefix: '',
      moduleName: 'templates'
    },


    // Enable or disable colors in the output (reporters and logs)
    colors: !!supportsColor,


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'coverage', 'mocha' ],
    // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
    coverageReporter: {
      type: 'lcov',
      dir: coverageDir,
      subdir: '.'
    },


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config[mainConfig.logLevel],
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    // how many browser should be started simultaneous
    concurrency: Infinity,
    // how long will Karma wait for a message from a browser before disconnecting from it (in ms).
    browserNoActivityTimeout: 100e3
  })
}
