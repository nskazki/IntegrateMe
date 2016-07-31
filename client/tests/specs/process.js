'use strict'

describe('process', function() {
  beforeEach(module('app.process'))
  beforeEach(module('templates'))

  var assert = chai.assert

  var cmpElement
  var cmpScope
  var ownScope

  beforeEach(inject(function($rootScope, $compile, ProcessMixin) {
    ownScope = $rootScope.$new()
    ownScope.$ctrl = new ProcessMixin()

    var tmpElmt = angular.element(
        '<app-process'
        + ' app-process-status="$ctrl.processCtrl.status"'
        + ' app-process-errors="$ctrl.processCtrl.errors"'
        + ' app-process-state="$ctrl.processCtrl.state">'
      + '</app-process>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))

  it('check one-way bindings', function() {
    cmpScope.$ctrl.appProcessStatus = 'some'
    cmpScope.$ctrl.appProcessErrors = 'other'
    ownScope.$digest()

    assert.equal(ownScope.$ctrl.processCtrl.status, undefined, 'status must be empty')
    assert.equal(ownScope.$ctrl.processCtrl.errors, undefined, 'errors must be empty')
  })
  
  it('all must be empty by default', function() {
    assert.equal(cmpScope.$ctrl.appProcessStatus, undefined, 'status must be empty')
    assert.equal(cmpScope.$ctrl.appProcessErrors, undefined, 'errors must be empty')

    assert.equal(findProcessStatus(), '', 'status view must be empty')
    assert.equal(findProcessErrors(), '', 'errors view must be empty')
  })

  it('check after #setInProcessState', function() {
    ownScope.$ctrl.processCtrl.setInProcessState()
    ownScope.$digest()

    assert.equal(cmpScope.$ctrl.appProcessStatus, 'In Progress...', 'status must be defined')
    assert.equal(cmpScope.$ctrl.appProcessErrors, undefined, 'errors must be empty')

    assert.equal(findProcessStatus(), 'In Progress...', 'status view must be defined')
    assert.equal(findProcessErrors(), '', 'errors view must be empty')
  })

  it('check after #setSuccessState', function() {
    ownScope.$ctrl.processCtrl.setSuccessState()
    ownScope.$digest()

    assert.equal(cmpScope.$ctrl.appProcessStatus, 'Success!', 'status must be defined')
    assert.equal(cmpScope.$ctrl.appProcessErrors, undefined, 'errors must be empty')

    assert.equal(findProcessStatus(), 'Success!', 'status view must be defined')
    assert.equal(findProcessErrors(), '', 'errors view must be empty')
  })

  it('check after #setProblemState (with empty err)', function() {
    ownScope.$ctrl.processCtrl.setProblemState()
    ownScope.$digest()

    assert.equal(cmpScope.$ctrl.appProcessStatus, 'Problem!', 'status must be defined')
    assert.deepEqual(cmpScope.$ctrl.appProcessErrors, ['Unknown Error!'], 'errors must be defined')

    assert.equal(findProcessStatus(), 'Problem!', 'status view must be defined')
    assert.equal(findProcessErrors(), 'Unknown Error!', 'errors view must be defined')
  })

  it('check after #setProblemState (with one error)', function() {
    ownScope.$ctrl.processCtrl.setProblemState({ error: 'test error!'})
    ownScope.$digest()

    assert.equal(cmpScope.$ctrl.appProcessStatus, 'Problem!', 'status must be defined')
    assert.deepEqual(cmpScope.$ctrl.appProcessErrors, ['test error!'], 'errors must be defined')

    assert.equal(findProcessStatus(), 'Problem!', 'status view must be defined')
    assert.equal(findProcessErrors(), 'test error!', 'errors view must be defined')
  })

  it('check after #setProblemState (with errors hash)', function() {
    ownScope.$ctrl.processCtrl.setProblemState({ errors: {
      'api_key': 'error test', 'some_other': 'wrong!'
    }})
    ownScope.$digest()

    var actBindings = cmpScope.$ctrl.appProcessErrors
    var expBindings = [ 'Api Key: error test', 'Some Other: wrong!' ]

    assert.equal(cmpScope.$ctrl.appProcessStatus, 'Problem!', 'status must be defined')
    assert.deepEqual(actBindings, expBindings, 'errors must be defined')

    var actView = findProcessErrors()
    var expView = 'Api Key: error testSome Other: wrong!'

    assert.equal(findProcessStatus(), 'Problem!', 'status view must be defined')
    assert.equal(actView, expView, 'errors view must be defined')
  })

  // helpers
  function findProcessStatus() {
    return cmpElement
      .find('[ng-bind="$ctrl.appProcessStatus"]')
      .text()
  }

  function findProcessErrors() {
    var oneError = cmpElement
      .find('[ng-bind="$ctrl.appProcessErrors[0]"]')
      .text()
    var hashError = cmpElement
      .find('[ng-bind="error"]')
      .text()
    return oneError + hashError
  }
})
