app.controller('ContactController', ['Auth', 'ContactsFactory', '$scope', function (Auth, ContactsFactory, $scope) {
  var self = this;

  self.contacts = ContactsFactory.contacts;

  self.search = '';
  self.org_type = '';
  self.ind_type = '';
  self.filter = {
  }


  self.contact_filter = [ {
    name: 'All Contacts',
    filter: {}
  }, {
    name: 'All Organizations',
    filter: { org: true }
  }, {
    name: 'Food Rescue Orgs',
    filter: { org_type: 'food_rescue' }
  }, {
    name: 'Sub-Distribution Orgs',
    filter: { org_type: 'sub_distribution' }
  }, {
    name: 'All Donors',
    filter: { donor: true }
  }, {
    name: 'Donor Orgs',
    filter: { org_type: 'donor' }
  }, {
    name: 'Individual Donors',
    filter: { donor: true, org: false }
  }];


  $scope.$on('user:updated', function () {
    ContactsFactory.getNonClients();
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
