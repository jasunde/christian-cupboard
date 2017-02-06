app.controller("FoodDriveController", 
  ['DonationsFactory', 'CategoryFactory', 'ContactsFactory', 'DistributionFactory', '$scope', 'Auth', '$q', 'dateRangeFilter', 'ConfirmFactory', '$uibModal', 'DateRangeFactory',
    function(DonationsFactory, CategoryFactory, ContactsFactory, DistributionFactory, $scope, Auth, $q, dateRangeFilter, ConfirmFactory, $uibModal, DateRangeFactory){
      var self = this;
      var verbose = false;

      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      };

      self.driveCategories = CategoryFactory.categories;
      self.driveContacts = ContactsFactory.contacts;
      self.driveDonations = DonationsFactory.donations;
      self.user = Auth.user

      $scope.daterange = DateRangeFactory.daterange;

      if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
        self.gotData = true;
      } else {
        self.gotData = false;
      }

      function getData() {
        var params = {
          start_date: $scope.daterange.start,
          end_date: $scope.daterange.end
        };

        $q.all([
          DonationsFactory.getDonations(params),
          ContactsFactory.getContacts()
        ])
          .then(function (response) {
            DistributionFactory.getDistributions(params);
            self.gotData = true;
          });
      }

      if(Auth.user.idToken){
        getData()
      }

      $scope.$on('user:updated', function (event, data) {
        if(Auth.user.idToken){
          getData();
        }
      });

      $scope.$watchCollection('daterange', getData);

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

      function packageParams() {
        return {
          start_date: $scope.daterange.start,
          end_date: $scope.daterange.end,
          org_type: '!food_rescue',
          contact_id: self.org_id
        };
      }

      self.getCsv = function () {
        var params = packageParams();
        DonationsFactory.getCsv(params);
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

