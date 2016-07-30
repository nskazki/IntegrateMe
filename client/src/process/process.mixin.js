'use strict'

angular
  .module('app.process')
  .factory('ProcessMixin', function() {
    return ProcessMixin
  })

function ProcessMixin() {
  var $ctrl = this

  $ctrl.processCtrl = {}
  $ctrl.processCtrl.errors = undefined
  $ctrl.processCtrl.status = undefined

  $ctrl.processCtrl.setInProcessState = setInProcessState
  $ctrl.processCtrl.setSuccessState = setSuccessState
  $ctrl.processCtrl.setProblemState = setProblemState

  function setInProcessState() {
    $ctrl.processCtrl.status = 'In Progress...'
    $ctrl.processCtrl.errors = undefined
  }

  function setSuccessState() {
    $ctrl.processCtrl.status = 'Success!'
    $ctrl.processCtrl.errors = undefined
  }

  function setProblemState(err) {
    $ctrl.processCtrl.status = 'Problem!'
    $ctrl.processCtrl.errors = error2array(err)
  }

  function error2array(rawErr) {
    var err = rawErr || {}
    var data = err.data || err

    if (!data.error && !data.errors) return [ 'Unknown Error!' ]
    if (data.error) return [ data.error ]

    return Object.keys(data.errors).map(function(key) {
      return upperWords(unSnakeCase(key)) + ': ' + data.errors[key]
    })
  }

  function unSnakeCase(str) {
    return str.replace(/_/g, ' ')
  }

  function upperWords(str) {
    return str.split(/\s/).map(function (word) {
      return /^[a-z]/.test(word.charAt(0))
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    }).join(' ')
  }
}
