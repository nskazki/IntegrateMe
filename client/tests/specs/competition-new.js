'use strict'

describe('competition-new', function() {
  beforeEach(module('ngComponentRouter'))
  beforeEach(module('app.config'))
  beforeEach(module('app.resources'))
  beforeEach(module('app.process'))
  beforeEach(module('app.competitions'))

  beforeEach(module('templates'))
  beforeEach(module('mock.competitions-router'))

  var assert = chai.assert

  var mailLists = [
    { id: '0', name: 'first-list'  },
    { id: '1', name: 'second-list' }]

  var baseItem = {
    name: 'test-item',
    owner_email: 'email@example.com',
    requires_entry_name: false,
    mail_api_key: 'test-api-key',
    mail_list_id: mailLists[0].id
  }

  var emptyItem = {
    name: undefined,
    owner_email: undefined,
    requires_entry_name: true,
    mail_api_key: undefined,
    mail_list_id: undefined
  }

  var cmpElement
  var cmpScope
  var ownScope

  var $httpBackend

  beforeEach(inject(function(_$httpBackend_, $rootScope, $compile) {
    $httpBackend = _$httpBackend_

    ownScope = $rootScope.$new()
    var tmpElmt = angular.element(
        '<app-competition-new'
      + '  on-create="$ctrl.update()">'
      + '</app-competition-new>')

    cmpElement = $compile(tmpElmt)(ownScope)
    ownScope.$apply()
    cmpScope = cmpElement.isolateScope()
  }))

  it('must be empty by default', function() {
    assert.deepEqual(cmpScope.$ctrl.newItem, emptyItem, 'must be empty')
  })

  it('check manual input', function() {
    setItemName(baseItem.name)
    setItemEmail(baseItem.owner_email)
    setItemRequires(baseItem.requires_entry_name)
    setItemApiKey(baseItem.mail_api_key)
    ownScope.$digest()

    // TODO add mail_list_id to test
    // I not found way to manual change select
    // input and sync it with angular model
    // But all other inputs work fine
    var actItem = _.omit(cmpScope.$ctrl.newItem, 'mail_list_id')
    var expItem = _.omit(baseItem, 'mail_list_id')
    assert.deepEqual(actItem, expItem)
  })

  it('check mailList fetching', function() {
    // put some API Key to the components
    // later this parameter will be sent to the backend
    var expMailApiKey = 'some_key'
    cmpScope.$ctrl.newItem.mail_api_key = expMailApiKey

    // setup GET /api/mail_list handler
    // reqMailApiKey will be defined by handler
    var reqMailApiKey
    $httpBackend
      .expectGET(/\/api\/mail_lists/)
      .respond(function(method, url, data, headers, params) {
        reqMailApiKey = params.mail_api_key
        return [200, mailLists]
      })

    // emit request and resolve it
    cmpScope.$ctrl.syncMailLists()
    $httpBackend.flush()

    // check reqMailApiKey
    assert.equal(reqMailApiKey, expMailApiKey, 'mail_api_keys must be equals')

    // check component mailLists
    var mailListCleaner = _.partial(_.pick, _, 'id', 'name')
    var actMailList = mailLists.map(mailListCleaner )
    var expMailList = cmpScope.$ctrl.mailLists.map(mailListCleaner)
    assert.deepEqual(actMailList, expMailList, 'mailLists must be equals')
  })

  it('check create', function() {
    // put baseItem to the components
    // later this object will be sent to the backend
    var expNewItem = baseItem
    cmpScope.$ctrl.newItem = expNewItem

    // setup POST /api/competitions/ handler
    // reqNewItem will be defined by handler
    var reqNewItem
    $httpBackend
      .expectPOST(/\/api\/competitions/)
      .respond(function(method, url, data) {
        reqNewItem = JSON.parse(data)
        return [200]
      })

    // setup component onCreate binding
    // on-create="$ctrl.update()"
    ownScope.$ctrl = { update: _.noop }
    sinon.spy(ownScope.$ctrl, 'update')

    // emit request and resolve it
    cmpScope.$ctrl.create()
    $httpBackend.flush()

    // check reqNewItem & $ctrl.update.callCount
    assert.deepEqual(reqNewItem, expNewItem, 'item must be equals')
    assert.equal(ownScope.$ctrl.update.callCount, 1)
  })

  // helpers
  function setItemName(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.name"]')
    elem.val(value).change()
  }

  function setItemEmail(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.owner_email"]')
    elem.val(value).change()
  }

  function setItemRequires(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.requires_entry_name"]')
    // set value -> revert by trigger click x2
    elem.prop('checked', value).click().click()
  }

  function setItemApiKey(value) {
    var elem = cmpElement.find('[ng-model="$ctrl.newItem.mail_api_key"]')
    elem.val(value).change()
  }
})
