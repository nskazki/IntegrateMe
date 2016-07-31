'use strict'

angular
  .module('app.competitions')
  .component('appCompetitionList', {
    templateUrl: 'competitions/list/competition-list.html',
    controller: CompetitionList
  })

CompetitionList.$inject = ['$log',
  'CompetitionsResource', 'ProcessMixin']

function CompetitionList($log, CompetitionsResource, ProcessMixin) {
  var $ctrl = this
  ProcessMixin.call(this)

  $ctrl.list = []
  $ctrl.$onInit = init
  $ctrl.update = init

  function init() {
    return CompetitionsResource
      .query()
      .$promise.then(function(list) {
        $ctrl.list = list
        $log.info('CompetitionList#init - success')
      }, function(err) {
        $ctrl.processCtrl.setProblemState(err)
        $log.error('CompetitionList#init - problem: ', err)
        throw err
      })
  }
}
