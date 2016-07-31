'use strict'

angular
  .module('app.process')
  .factory('ProcessMixin', function() {
    return ProcessMixin
  })

function ProcessMixin() {
  var $ctrl = this

  var STATE_SUCCESS = 'SUCCESS'
  var STATE_PROBLEM = 'PROBLEM'
  var STATE_PROCESS = 'PROCESS'

  $ctrl.processCtrl = {}
  $ctrl.processCtrl.state  = undefined // control for view
  $ctrl.processCtrl.status = undefined // text for view
  $ctrl.processCtrl.errors = undefined

  $ctrl.processCtrl.setInProcessState = setInProcessState
  $ctrl.processCtrl.setSuccessState = setSuccessState
  $ctrl.processCtrl.setProblemState = setProblemState

  return $ctrl

  function setInProcessState() {
    $ctrl.processCtrl.state  = STATE_PROCESS
    $ctrl.processCtrl.status = 'In Progress...'
    $ctrl.processCtrl.errors = undefined
  }

  function setSuccessState() {
    $ctrl.processCtrl.state  = STATE_SUCCESS
    $ctrl.processCtrl.status = 'Success!'
    $ctrl.processCtrl.errors = undefined
  }

  function setProblemState(err) {
    $ctrl.processCtrl.state  = STATE_PROBLEM
    $ctrl.processCtrl.status = 'Problem!'
    $ctrl.processCtrl.errors = error2array(err)
  }

  function error2array(rawErr) {
    var err = rawErr || {}
    var data = err.data || err
    var status = err.status

    if (status === -1) return [ 'Check Your Internet connection!' ]
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
