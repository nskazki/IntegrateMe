'use strict'

describe('entry-new', function() {
  beforeEach(module('ngComponentRouter'))
  beforeEach(module('app.config'))
  beforeEach(module('app.resources'))
  beforeEach(module('app.process'))
  beforeEach(module('app.entries'))

  beforeEach(module('templates'))

  var assert = chai.assert

  var baseEntry = {
    competition_id: undefined,
    name: 'test',
    email: 'text@example.com'
  }

  var emptyEntry = {
    competition_id: undefined,
    name: undefined,
    email: undefined
  }

  var baseBindings = {
    competition_id: '0',
    requires_entry_name: false
  }

  var cmpElement
  var cmpScope
  var ownScope

  var $httpBackend

  beforeEach(inject(function(_$httpBackend_, $rootScope, $compile) {
    $httpBackend = _$httpBackend_

    ownScope = $rootScope.$new()
    ownScope.$ctrl = baseBindings
    var tmpElmt = angular.element(
        '<app-entry-new'
      + '  app-competition-id="$ctrl.competition_id"'
      + '  app-requires-entry-name="$ctrl.requires_entry_name">'
      + '</app-entry-new>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))

  it('must be empty by default', function() {
    assert.deepEqual(cmpScope.$ctrl.newItem, emptyEntry, 'must be empty')
  })

  it('check is name depending on the requires_entry_name', function() {
    // name field must be disabled
    ownScope.$ctrl.requires_entry_name = false
    ownScope.$digest()
    assert.equal(findEntryName().prop('disabled'), true, 'must be disabled')
    // name field must be enabled
    ownScope.$ctrl.requires_entry_name = true
    ownScope.$digest()
    assert.equal(findEntryName().prop('disabled'), false, 'must be disabled')
  })

  it('check manual input', function() {
    // update view
    setEntryName(baseEntry.name)
    setEntryEmail(baseEntry.email)
    ownScope.$digest()

    // check state
    var actItem = cmpScope.$ctrl.newItem
    var expItem = baseEntry
    assert.deepEqual(actItem, expItem)
  })

  it('check create', function() {
    // put baseEntry to the components
    // later this object will be sent to the backend
    cmpScope.$ctrl.newItem = baseEntry

    // setup POST /api/entries/ handler
    // reqNewItem will be defined by handler
    var reqNewItem
    $httpBackend
      .expectPOST(/\/api\/entries/)
      .respond(function(method, url, data) {
        reqNewItem = JSON.parse(data)
        return [200]
      })

    // emit request and resolve it
    cmpScope.$ctrl.create()
    $httpBackend.flush()

    // check reqNewItem
    var act = reqNewItem
    var exp = _.extend({}, baseEntry,
      { competition_id: baseBindings.competition_id })
    assert.deepEqual(act, exp, 'item must be equals')
  })

  // helpers
  function setEntryName(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.name"]')
    elem.val(value).change()
  }

  function setEntryEmail(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.email"]')
    elem.val(value).change()
  }

  function findEntryName() {
    return cmpElement.find('[ng-model="$ctrl.newItem.name"]')
  }
})
