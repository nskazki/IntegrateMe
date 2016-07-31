'use strict'

angular
  .module('app.process', [])
  .component('appProcess', {
    templateUrl: 'process/process.html',
    bindings: {
      appProcessStatus: '<',
      appProcessErrors: '<',
      appProcessState: '<'
    }
  })
