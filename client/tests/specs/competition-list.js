'use strict'

describe('competition-list', function() {
  beforeEach(module('ngComponentRouter'))
  beforeEach(module('app.config'))
  beforeEach(module('app.resources'))
  beforeEach(module('app.process'))
  beforeEach(module('app.competitions'))

  beforeEach(module('templates'))
  beforeEach(module('mock.competitions-router'))

  var assert = chai.assert

  var baseItems = [{
    id: '0',
    name: 'first-item',
    owner_email: 'first-email@example.com',
    requires_entry_name: false
  }, {
    id: '1',
    name: 'second-item',
    owner_email: 'second-email@example.com',
    requires_entry_name: true
  }]

  var cmpElement
  var cmpScope
  var ownScope

  var $httpBackend

  beforeEach(inject(function(_$httpBackend_) {
    // setup GET /api/competition handler
    $httpBackend = _$httpBackend_
    $httpBackend
      .whenGET(/\/api\/competitions/)
      .respond(baseItems)
  }))

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  })

  beforeEach(inject(function($rootScope, $compile) {
    // create stuff
    ownScope = $rootScope.$new()
    var tmpElmt = angular.element(
      '<app-competition-list>'
      + '</app-competition-list>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))

  it('must fetch list on init', function() {
    // check init state
    assert.deepEqual(cmpScope.$ctrl.list, [], 'must be empty by default')

    // resolve request
    $httpBackend.flush()

    // check new state
    var itemKeys = [ 'id', 'name', 'owner_email', 'requires_entry_name' ]
    var itemCleaner = _.partial(_.pick, _, itemKeys)
    var actItems = cmpScope.$ctrl.list.map(itemCleaner)
    var expItems = baseItems.map(itemCleaner)
    assert.deepEqual(actItems, expItems, 'must be defined')

    // check view
    assert.equal(findItems().length, baseItems.length, 'count of view items')
  })

  it('must fetch list on update', function() {
    $httpBackend.flush()     // $ctrl.list define
    cmpScope.$ctrl.list = [] // $ctrl.list flushed
    ownScope.$digest()

    // check view
    assert.equal(findItems().length, 0, 'view must be empty')

    // emit & resolve request
    cmpScope.$ctrl.update()
    $httpBackend.flush()

    // check new state
    var itemKeys = [ 'id', 'name', 'owner_email', 'requires_entry_name' ]
    var itemCleaner = _.partial(_.pick, _, itemKeys)
    var actItems = cmpScope.$ctrl.list.map(itemCleaner)
    var expItems = baseItems.map(itemCleaner)
    assert.deepEqual(actItems, expItems, 'must be defined')

    // check view
    assert.equal(findItems().length, baseItems.length, 'count of view items')
  })

  // helpers
  function findItems() {
    return cmpElement.find('[app-item="item"]')
  }
})
