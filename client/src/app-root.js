'use strict'

angular
  .module('app', [
    'ngComponentRouter',
    'angular-loading-bar', 'ngAnimate',
    'app.config',
    'app.resources',
    'app.process',
    'app.competitions',
    'app.entries'
  ])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true)
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false
  }])
  .component('appRoot', {
    templateUrl: 'app-root.html',
    $routeConfig: [{
      path: '/competitions/...',
      name: 'Competitions',
      component: 'appCompetitions',
      useAsDefault: true
    }]
  })
  .value('$routerRootComponent', 'appRoot')
