app.controller("FoodDriveController",
  ['DonationsFactory', 'CategoryFactory', 'ContactsFactory', 'DistributionFactory', '$scope', 'Auth', '$q', 'dateRangeFilter', 'ConfirmFactory', '$uibModal',
    function(DonationsFactory, CategoryFactory, ContactsFactory, DistributionFactory, $scope, Auth, $q, dateRangeFilter, ConfirmFactory, $uibModal){
      var self = this;
      var verbose = true;

      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      };

      self.thisDonation = {};

      self.driveCategories = CategoryFactory.categories;
      self.driveContacts = ContactsFactory.contacts;
      self.driveDonations = DonationsFactory.donations;
      self.user = Auth.user;
      self.atLeastOneWeight = false;

      if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
        self.gotData = true;
      } else {
        self.gotData = false;
      }

      if(Auth.user.idToken){
        $q.all([
          DonationsFactory.getDonations(),
          ContactsFactory.getContacts()
        ])
          .then(function (response) {
            DistributionFactory.getDistributions();
            self.gotData = true;
          });
      }

      $scope.$on('user:updated', function (event, data) {

        if(Auth.user.idToken){
          $q.all([
            DonationsFactory.getDonations(),
            ContactsFactory.getContacts()
          ])
            .then(function (response) {
              DistributionFactory.getDistributions();
              self.gotData = true;
            });
        }
      });

      self.submitDonation = function() {
        if(verbose) {console.log("Submitting newDonation", self.newDonation);
        }
        self.newDonation.saving=true;
        DonationsFactory.submitDonations(self.newDonation)
          .then(function (result) {
            self.newDonation.saving=false;
            self.newDonation = {
              contact_id: undefined,
              timestamp: new Date(),
            };
          })
          .catch(function (err) {
            self.newDonation.saving = false;
          });
      };

      self.editDonation = function(donation) {
        if(verbose) {console.log("editing", donation); }

        donation.saving=true;

        DonationsFactory.editDonations(donation)
          .then(function (result){
            donation.saving=false;
          })
          .catch(function (err) {
            donation.editable = false;
            donation.saving = false;
          });
      };

      self.deleteDonation = function(donation) {
        if(verbose) {console.log("deleting");
        }

        var confirm = ConfirmFactory.confirm('sm', {action: 'Delete', type: 'Donation', item: donation});

        confirm.result.then(function (config) {
          donation.saving=true;
          DonationsFactory.deleteDonations(donation)
            .then(function (result){
              donation.saving=false;
            });
        })
          .catch(function (err) {
            donation.saving = false;
          });
      };

      self.toggleEditable = function (donation) {
        if(donation.editable) {
          donation.editable = false;
        } else {
          donation.editable = true;
        }
      };

      self.getCsv = function () {
        DonationsFactory.getCsv();
      }

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd
      }
      if(mm<10) {
        mm='0'+mm
      }
      today = mm+'/'+dd+'/'+yyyy;


      var now = new Date().getTime();
      $scope.date = new Date(2015, 10, 10);
      $scope.ago = now < $scope.date.getTime();
      $scope.before = now > $scope.date.getTime();
      $scope.daterange = {
        start: new Date(today),
        end: new Date(today)
      };

      self.valueCheck = function () {
        if(hasOne(self.newDonation.categories)) {
          return false;
        } else {
          return true;
        }
      }

      self.openModal = function (size, donation, action, categories) {
        // var parentElem = parentSelector ? 
        //   angular.element($document[0].querySelector(parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/views/modals/driveModal.html',
          controller: 'DriveCtrl',
          controllerAs: '$ctrl',
          size: size,
          // appendTo: parentElem,
          resolve: {
            donation: function () {
              return donation;
            },
            action: function () {
              return action;
            },
            categories: function () {
              return categories;
            }
          }
        });

        modalInstance.result.then(function (result) {
          console.log('action', result.action);
          if(result.action === 'Edit') {
            console.log('edit donation', result.donation);
            self.editDonation(result.donation);
          }
        }, function () {
          // $log.info('Modal dismissed at: ' + new Date());
        });
      };


      function hasOne(obj) {
        var result = false;
        if(obj) {
          var keys = Object.keys(obj);

          if(keys) {
            result = keys.some(function (key) {
              return obj[key];
            });
          }
        }
        return result;
      }
    }]);

app.controller('DriveCtrl', function ($uibModalInstance, donation, action, categories) {
  var $ctrl = this;
  $ctrl.donation = donation;
  $ctrl.action = action;
  $ctrl.driveCategories = categories;

  console.log($ctrl.donation);
  console.log($ctrl.driveCategories.list[0]);
  $ctrl.accept = function () {
    $uibModalInstance.close({
      donation: $ctrl.donation,
      action: action
    });
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

