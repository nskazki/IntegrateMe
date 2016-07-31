'use strict'

describe('competition-item', function() {
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
  var updatedItem = {
    id: '1',
    name: 'new-item',
    owner_email: 'new-test@email.com',
    requires_entry_name: true
  }

  var cmpElement
  var cmpScope
  var ownScope

  beforeEach(inject(function($rootScope, $compile) {
    ownScope = $rootScope.$new()
    ownScope.item = angular.extend({}, baseItem)

    var tmpElmt = angular.element(
        '<app-competition-item'
      + ' app-item="item"'
      + '</app-competition-item>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))


  it('check one-way bindings', function() {
    cmpScope.$ctrl.appItem = { new: 'object' }
    ownScope.$digest()

    assert.deepEqual(ownScope.item, baseItem, 'item must be safe')
  })

  it('check appItem after setup', function() {
    assert.deepEqual(cmpScope.$ctrl.appItem, ownScope.item, 'binding item')

    assert.equal(getItemTitle(), cmpScope.$ctrl.getTitle(), 'view title')
    assert.equal(getItemName(), ownScope.item.name, 'view name')
    assert.equal(getItemEmail(), ownScope.item.owner_email, 'view owner_email')
    assert.equal(getItemRequires(), ownScope.item.requires_entry_name, 'view requires_entry_name')
  })

  it('check appItem after update', function() {
    ownScope.item = angular.extend({}, updatedItem)
    ownScope.$digest()

    assert.deepEqual(cmpScope.$ctrl.appItem, ownScope.item, 'binding item')

    assert.equal(getItemTitle(), cmpScope.$ctrl.getTitle(), 'view title')
    assert.equal(getItemName(), ownScope.item.name, 'view name')
    assert.equal(getItemEmail(), ownScope.item.owner_email, 'view owner_email')
    assert.equal(getItemRequires(), ownScope.item.requires_entry_name, 'view requires_entry_name')
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
