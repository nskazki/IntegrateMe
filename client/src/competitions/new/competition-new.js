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
  ProcessMixin.call($ctrl)

  $ctrl.$onInit = clear
  $ctrl.create = create
  $ctrl.syncMailLists = syncMailLists

  function clear() {
    $ctrl.mailLists = []

    $ctrl.newItem = {
      name: undefined,
      owner_email: undefined,
      requires_entry_name: undefined,
      mail_api_key: undefined,
      mail_list_id: undefined
    }

    $log.info('CompetitionNew#clear - success')
  }

  function syncMailLists() {
    $ctrl.mailLists = []
    $ctrl.processCtrl.setInProcessState()

    return MailListsResource
      .query({ mail_api_key: $ctrl.newItem.mail_api_key })
      .$promise.then(function(mailLists) {
        $ctrl.mailLists = mailLists
        $ctrl.processCtrl.setSuccessState()
        $log.info('CompetitionNew#syncMailLists - success')
      }, function(err) {
        $ctrl.processCtrl.setProblemState(err)
        $log.error('CompetitionNew#syncMailLists - problem:', err)
        throw err
      })
  }

  function create() {
    $ctrl.processCtrl.setInProcessState()

    return CompetitionsResource
      .save($ctrl.newItem)
      .$promise.then(function() {
        $ctrl.onCreate()
        $ctrl.processCtrl.setSuccessState()
        $log.info('CompetitionNew#create - success')
      }, function(err) {
        $ctrl.processCtrl.setProblemState(err)
        $log.error('CompetitionNew#create - problem', err)
        throw err
      })
  }
}
