'use strict'

angular
  .module('app.entries')
  .component('appEntryNew', {
    templateUrl: 'entries/new/entry-new.html',
    controller: EntryNew,
    bindings: {
      appCompetitionId: '<',
      appRequiresEntryName: '<'
    }
  })

EntryNew.$inject = [
  '$log',
  'EntriesResource', 'ProcessMixin']

function EntryNew($log, EntriesResource, ProcessMixin) {
  var $ctrl = this
  ProcessMixin.call($ctrl)

  $ctrl.$onInit = clear
  $ctrl.create = create

  function clear() {
    $ctrl.newItem = {
      competition_id: undefined,
      name: undefined,
      email: undefined
    }

    $log.info('EntryNew#clear - success')
  }

  function create() {
    $ctrl.newItem.competition_id = $ctrl.appCompetitionId
    $ctrl.processCtrl.setInProcessState()

    return EntriesResource
      .save($ctrl.newItem)
      .$promise.then(function() {
        $ctrl.processCtrl.setSuccessState()
        $log.info('EntryNew#create - success')
      }, function(err) {
        $ctrl.processCtrl.setProblemState(err)
        $log.error('EntryNew#create - problem', err)
        throw err
      })
  }
}
