'use strict'

describe('competition-item.self-init', function() {
  beforeEach(module('ngComponentRouter'))
  beforeEach(module('app.config'))
  beforeEach(module('app.resources'))
  beforeEach(module('app.process'))
  beforeEach(module('app.competitions'))

  beforeEach(module('templates'))
  beforeEach(module('mock.competitions-router'))

  var assert = chai.assert

  var baseItem = {
    id: '0',
    name: 'item',
    owner_email: 'test@email.com',
    requires_entry_name: false
  }

  var cmpElement
  var cmpScope
  var ownScope

  beforeEach(inject(function($rootScope, $compile) {
    ownScope = $rootScope.$new()

    var tmpElmt = angular.element(
        '<app-competition-item>'
      + '</app-competition-item>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))

  var $httpBackend

  beforeEach(inject(function(_$httpBackend_, config) {
    $httpBackend = _$httpBackend_
    $httpBackend
      .whenRoute('GET', config.apiUrl + '/api/competitions/:id')
      .respond(function(method, url, data, headers, params) {
        return [200, angular.extend({}, baseItem, { id: params.id })]
      })
  }))

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  })

  it('must be empty by default', function() {
    assert.deepEqual(cmpScope.$ctrl.appItem, undefined, 'must be empty')
  })

  it('must fetch item on routerActivate', function() {
    // emit & resolve request
    var route = { params: { id: 0 } }
    cmpScope.$ctrl.$routerOnActivate(route)
    $httpBackend.flush()

    // check state
    var actAppItem = _.pick(cmpScope.$ctrl.appItem, _.keys(baseItem))
    assert.deepEqual(actAppItem, baseItem, 'binding item')

    // check view
    assert.equal(getItemTitle(), cmpScope.$ctrl.getTitle(), 'view title')
    assert.equal(getItemName(), baseItem.name, 'view name')
    assert.equal(getItemEmail(), baseItem.owner_email, 'view owner_email')
    assert.equal(getItemRequires(), baseItem.requires_entry_name, 'view requires_entry_name')
  })

  // helpers
  function getItemTitle() {
    return cmpElement
      .find('[ng-bind="$ctrl.getTitle()"]')
      .text()
  }

  function getItemName() {
    return cmpElement
      .find('[ng-model="$ctrl.appItem.name"]')
      .val()
  }

  function getItemEmail() {
    return cmpElement
      .find('[ng-model="$ctrl.appItem.owner_email"]')
      .val()
  }

  function getItemRequires() {
    return cmpElement
      .find('[ng-model="$ctrl.appItem.requires_entry_name"]')
      .prop('checked')
  }
})
