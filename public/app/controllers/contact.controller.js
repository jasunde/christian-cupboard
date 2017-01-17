app.controller('ContactController', ['Auth', 'ContactsFactory', '$scope', function (Auth, ContactsFactory, $scope) {
  var self = this;

  self.contacts = ContactsFactory.contacts;
  self.filter = {
  };

  self.search = '';
  self.org_type = [];
  self.ind_type = [];

  self.org_types = [ {
    name: '',
    filter: [
      {org_type: ''},
      {org: ''}
    ]
  }, {
    name: 'All',
    filter: [
      {org_type: ''},
      { org: true }
    ]
  }, {
    name: 'Food Rescue',
    filter: [{
      org_type: 'food_rescue'
    }]
  }, {
    name: 'Sub-Distribution',
    filter: [{
      org_type: 'sub_distribution'
    }]
  }, {
    name: 'Donor',
    filter: [{
      org_type: 'donor'
    }]
  } ];

  self.ind_types = [{
    name: '',
    filter: [
      {org: ''},
      {donor: ''}
    ]
  }, {
    name: 'All',
    filter: [
      {org: false},
      {donor: ''}
    ]
  }, {
    name: 'Client',
    filter: [
      {org: false},
      {donor: false}
    ]
  }, {
    name: 'Donor',
    filter: [
      {org: false},
      {donor: true}
    ]
  }];


  $scope.$on('user:updated', function () {
    ContactsFactory.getContacts();
  });

  self.changeFilter = function (filters) {
    filters.forEach(function (filter) {
      var key = Object.keys(filter)[0];
      if(filter[key] === '') {
        delete self.filter[key];
      } else {
        self.filter[key] = filter[key];
      }
    })
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
