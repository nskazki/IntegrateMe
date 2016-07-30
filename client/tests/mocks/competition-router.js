'use strict'

angular
  .module('mock.competitions-router', [])
  .component('mockEmptyComponent', {})
  .component('mockCompetitionsRouter', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [{
      path: '/',
      name: 'CompetitionList',
      component: 'mockEmptyComponent',
    }, {
      path: '/new',
      name: 'CompetitionNew',
      component: 'mockEmptyComponent'
    }, {
      path: '/:id',
      name: 'CompetitionItem',
      component: 'mockEmptyComponent'
    }, {
      path: '/:id/with-new-entry',
      name: 'CompetitionItemWithNewEntry',
      component: 'mockEmptyComponent'
    }]
  })
  .value('$routerRootComponent', 'mockCompetitionsRouter')
