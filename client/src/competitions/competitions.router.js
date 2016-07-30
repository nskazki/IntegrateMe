'use strict'

angular
  .module('app.competitions', [])
  .component('appCompetitions', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [{
      path: '/',
      name: 'CompetitionList',
      component: 'appCompetitionList',
      useAsDefault: true
    },{
      path: '/:id',
      name: 'CompetitionItem',
      component: 'appCompetitionItem'
    }]
  })
