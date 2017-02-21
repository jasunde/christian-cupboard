app.controller('ContactController',
  ['Auth', 'ContactsFactory', '$scope', '$uibModal', '$document', 'dateRangeFilter',
    function (Auth, ContactsFactory, $scope, $uibModal, $document, dateRangeFilter) {
      var self = this;

      self.contacts = ContactsFactory.contacts;
      self.newContact = {};

      console.log('contacts', self.contacts);
      self.search = '';
      self.org_type = '';
      self.ind_type = '';
      self.filter = {
      };

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd;
      }
      if(mm<10) {
        mm='0'+mm;
      }
      today = mm+'/'+dd+'/'+yyyy;


      $scope.daterange = {
        start: null,
        end: null
      };

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

      function sortName(contact) {
        var name = '';
        if(contact.org_name) {
          name = contact.org_name.toLowerCase();
        } else {
          name = contact.first_name.toLowerCase();
        }
        return name;
      }

      function getSortNames() {
        self.contacts.list.forEach(function (contact) {
          contact.sort_name = sortName(contact);
        });
      }

      if(Auth.user.is_admin) {
        ContactsFactory.getNonClients()
          .then(getSortNames);
      }

      $scope.$on('user:updated', function () {
        if(Auth.user.is_admin) {
          ContactsFactory.getNonClients()
            .then(getSortNames);
        }
      });

      self.add = function () {
        self.newContact.saving = true;

        ContactsFactory.addContact(self.newContact)
          .then(function (result) {
            getSortNames();
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
            getSortNames();
            item.saving = false;
          });
      };

      self.animationsEnabled = false;

      self.openModal = function (size, contact, action) {
        // var parentElem = parentSelector ?
        //   angular.element($document[0].querySelector(parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: self.animationsEnabled,
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
            },
            action: function () {
              return action;
            }
          }
        });

        modalInstance.result.then(function (result) {
          console.log('action', result.action);
          if(result.action === 'Add') {
            self.newContact = result.contact;
            if(self.newContact.org_name) {
              self.newContact.org = true;
              if(self.newContact.org_type === 'food_rescue') {
                self.newContact.donor = true;
              } else {
                self.newContact.donor = false;
              }
            }
            self.add();
            console.log('new contact', self.newContact);
          } else if (result.action === 'Edit') {
            console.log('edit contact', result.contact);
            self.update(result.contact);
          }
        }, function () {
          // $log.info('Modal dismissed at: ' + new Date());
        });
      };

  self.getCsv = function(){
    ContactsFactory.getCsv();
  };

}]);

app.controller('ContactCtrl', function ($uibModalInstance, contact, action) {
  var $ctrl = this;
  $ctrl.contact = contact;
  $ctrl.action = action;

  $ctrl.accept = function () {
    $uibModalInstance.close({
      contact: $ctrl.contact,
      action: action
    });
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
