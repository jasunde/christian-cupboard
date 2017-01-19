app.controller('ContactController', ['Auth', 'ContactsFactory', '$scope', function (Auth, ContactsFactory, $scope) {
  var self = this;

  self.contacts = ContactsFactory.contacts;

  self.search = '';
  self.org_type = '';
  self.ind_type = '';
  self.filter = {
  }


  self.org_types = [ {
    name: '',
    filter: {}
  }, {
    name: 'All',
    filter: {org: true}
  }, {
    name: 'Food Rescue',
    filter: {org_type: 'food_rescue' }
  }, {
    name: 'Sub-Distribution',
    filter: {org_type: 'sub_distribution' }
  }, {
    name: 'Donor',
    filter: {org_type: 'donor' }
  } ];

  self.ind_types = [{
    name: '',
    filter:  {}
  }, {
    name: 'All',
    filter: {org: false}
    
  }, {
    name: 'Client',
    filter: {donor: false, org: false}
    
  }, {
    name: 'Donor',
    filter: {donor: true, org: false}
    
  }];


  $scope.$on('user:updated', function () {
    ContactsFactory.getContacts();
  });

  self.changeFilter = function (filter) {
    self.filter
  }
  
  self.add = function () {
    self.newContact.saving = true;

    ContactsFactory.addContact(self.newContact)
    .then(function (result) {
      self.newContact = {};
      self.newContact.saving = false;
    });
  };

  self.toggleEditable = function (item) {
    if(item.editable) {
      item.editable = false;
    } else {
      item.editable = true;
    }
  };

  self.update = function (item) {
    item.saving = true;

    ContactsFactory.updateContact(item)
      .then(function (result) {
        item.saving = false;
      });
  };
}]);
