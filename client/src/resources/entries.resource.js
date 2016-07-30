'use strict'

angular
  .module('app.resources')
  .factory('EntriesResource', EntriesResource)

EntriesResource.$inject = ['$resource', 'config']

function EntriesResource($resource, config) {
  return $resource(config.apiUrl + '/api/entries/:id')
}
