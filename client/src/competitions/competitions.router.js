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
    }, {
      path: '/new',
      name: 'CompetitionNew',
      component: 'appCompetitionNew'
    }, {
      path: '/:id',
      name: 'CompetitionItem',
      component: 'appCompetitionItem'
    }, {
      path: '/:id/with-new-entry',
      name: 'CompetitionItemWithNewEntry',
      component: 'appCompetitionItemWithNewEntry'
    }]
  })
