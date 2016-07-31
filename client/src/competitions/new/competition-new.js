'use strict'

angular
  .module('app.competitions')
  .component('appCompetitionNew', {
    templateUrl: 'competitions/new/competition-new.html',
    controller: CompetitionNew,
    bindings: { onCreate: '&' }
  })

CompetitionNew.$inject = [
  '$log',
  'CompetitionsResource', 'MailListsResource',
  'ProcessMixin']

function CompetitionNew($log, CompetitionsResource,
  MailListsResource, ProcessMixin) {

  var $ctrl = this

  $ctrl.$onInit = clear
  $ctrl.create = ProcessMixin.call(create)
  $ctrl.syncMailLists = ProcessMixin.call(syncMailLists)

  function clear() {
    $ctrl.mailLists = []

    $ctrl.newItem = {
      name: undefined,
      owner_email: undefined,
      requires_entry_name: true,
      mail_api_key: undefined,
      mail_list_id: undefined
    }

    $log.info('CompetitionNew#clear - success')
  }

  function syncMailLists() {
    $ctrl.mailLists = []
    $ctrl.syncMailLists.processCtrl.setInProcessState()

    return MailListsResource
      .query({ mail_api_key: $ctrl.newItem.mail_api_key })
      .$promise.then(function(mailLists) {
        $ctrl.mailLists = mailLists
        $ctrl.syncMailLists.processCtrl.setSuccessState()
        $log.info('CompetitionNew#syncMailLists - success')
      }, function(err) {
        $ctrl.syncMailLists.processCtrl.setProblemState(err)
        $log.error('CompetitionNew#syncMailLists - problem:', err)
        throw err
      })
  }

  function create() {
    $ctrl.create.processCtrl.setInProcessState()

    return CompetitionsResource
      .save($ctrl.newItem)
      .$promise.then(function() {
        $ctrl.onCreate()
        $ctrl.create.processCtrl.setSuccessState()
        $log.info('CompetitionNew#create - success')
      }, function(err) {
        $ctrl.create.processCtrl.setProblemState(err)
        $log.error('CompetitionNew#create - problem', err)
        throw err
      })
  }
}
