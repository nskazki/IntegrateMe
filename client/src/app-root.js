'use strict'

angular
  .module('app', [
    'ngComponentRouter',
    'angular-loading-bar', 'ngAnimate',
    'app.resources',
    'app.competitions',
    'app.entries'
  ])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true)
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false
  }])
  .constant('config', {
    apiUrl: 'http://localhost:3000'
  })
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
