'use strict'

angular
  .module('app.resources')
  .factory('CompetitionsResource', CompetitionsResource)

CompetitionsResource.$inject = ['$resource', 'config']

function CompetitionsResource($resource, config) {
  return $resource(config.apiUrl + '/api/competitions/:id')
}
