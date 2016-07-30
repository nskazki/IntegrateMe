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
  'CompetitionsResource', 'MailListsResource']

function CompetitionNew($log, CompetitionsResource, MailListsResource) {
  var $ctrl = this

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

    return MailListsResource
      .query({ mail_api_key: $ctrl.newItem.mail_api_key })
      .$promise.then(function(mailLists) {
        $ctrl.mailLists = mailLists
        $log.info('CompetitionNew#syncMailLists - success')
      }, function(err) {
        $log.error('CompetitionNew#syncMailLists - problem:', err)
        throw err
      })
  }

  function create() {
    return CompetitionsResource
      .save($ctrl.newItem)
      .$promise.then(function() {
        $ctrl.onCreate()
        $log.info('CompetitionNew#create - success')
      }, function(err) {
        $log.error('CompetitionNew#create - problem', err)
        throw err
      })
  }
}
