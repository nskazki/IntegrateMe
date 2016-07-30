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
  'EntriesResource']

function EntryNew($log, EntriesResource) {
  var $ctrl = this

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

    return EntriesResource
      .save($ctrl.newItem)
      .$promise.then(function() {
        $log.info('EntryNew#create - success')
      }, function(err) {
        $log.error('EntryNew#create - problem', err)
        throw err
      })
  }
}
