'use strict'

angular
  .module('app.resources')
  .factory('MailListsResource', MailListsResource)

MailListsResource.$inject = ['$resource', 'config']

function MailListsResource($resource, config) {
  return $resource(config.apiUrl + '/api/mail_lists')
}
