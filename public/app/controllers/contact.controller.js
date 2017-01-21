app.controller('ContactController', 
  ['Auth', 'ContactsFactory', '$scope', '$uibModal', '$document',
  function (Auth, ContactsFactory, $scope, $uibModal, $document) {
  var self = this;

  self.contacts = ContactsFactory.contacts;
  self.newContact = {};

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

  self.animationsEnabled = true;

  self.openModal = function (size, contact) {
    // var parentElem = parentSelector ? 
    //   angular.element($document[0].querySelector(parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      // animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/views/modals/contactModal.html',
      controller: 'ContactCtrl',
      controllerAs: '$ctrl',
      size: size,
      // appendTo: parentElem,
      resolve: {
        contact: function () {
          return contact;
        }
      }
    });

    modalInstance.result.then(function (contact) {
      self.newContact = contact;
      console.log('new contact', self.newContact);
      // self.add();
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };

}]);

app.controller('ContactCtrl', function ($uibModalInstance, contact) {
  var $ctrl = this;
  $ctrl.contact = contact;

  $ctrl.add = function () {
    $uibModalInstance.close($ctrl.contact);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
