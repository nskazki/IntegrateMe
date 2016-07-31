'use strict'

angular
  .module('app.competitions')
  .component('appCompetitionItem', {
    templateUrl: 'competitions/item/competition-item.html',
    controller: CompetitionItem,
    bindings: { appItem: '<?' }
  })
  .component('appCompetitionItemWithNewEntry', {
    templateUrl: 'competitions/item/competition-item-with-new-entry.html',
    controller: CompetitionItem,
    bindings: { appItem: '<?' }
  })

CompetitionItem.$inject = ['$log',
  'CompetitionsResource', 'ProcessMixin']

function CompetitionItem($log, CompetitionsResource, ProcessMixin) {
  var $ctrl = this
  ProcessMixin.call(this)

  $ctrl.$routerOnActivate = fetch
  $ctrl.getTitle = getTitle

  function fetch(route) {
    return CompetitionsResource
      .get({ id: route.params.id })
      .$promise.then(function(res) {
        $ctrl.appItem = res
        $log.info('CompetitionItem#fetch - success')
      }, function(err) {
        $ctrl.processCtrl.setProblemState(err)
        $log.error('CompetitionItem#fetch - problem: ', err)
        throw err
      })
  }

  function getTitle() {
    return !!$ctrl.appItem
      ? 'Competition #' + $ctrl.appItem.id
      : undefined
  }
}
