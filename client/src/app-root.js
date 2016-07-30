'use strict'

angular
  .module('app', [
    'ngComponentRouter',
    'app.resources',
    'app.competitions'
  ])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
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
