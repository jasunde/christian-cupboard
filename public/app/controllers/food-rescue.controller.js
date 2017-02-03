app.controller("FoodRescueController", 
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 'dateRangeFilter', 'mergeCategoriesFilter', 'ConfirmFactory', 'toastr',
    function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q, dateRangeFilter, mergeCategoriesFilter, ConfirmFactory, toastr){

      var self = this;
      var verbose = true;

      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      };

      self.thisDonation = {};

      self.rescueCategories = CategoryFactory.categories;
      self.rescueContacts = ContactsFactory.contacts;
      self.rescueDonations = DonationsFactory.donations;
      self.user = Auth.user;
      
      $scope.daterange = {
        start: new Date(),
        end: new Date()
      };

      function pickStartDate(isAdmin) {
        var monthsPrior = 0;
        if(isAdmin) {
          monthsPrior = 2;
        } else {
          monthsPrior = 1;
        }
        return moment().subtract(monthsPrior, 'months').toDate();
      }

      function setStartDate(isAdmin) {
        $scope.daterange.start = pickStartDate(isAdmin);
      }

      console.log(self.rescueDonations);

      if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
        self.gotData = true;
      } else {
        self.gotData = false;
      }

      function getData() {
        $q.all([
          DonationsFactory.getDonations(),
          ContactsFactory.getContacts()
        ])
          .then(function (response) {
            DistributionFactory.getDistributions();
            self.gotData = true;
          });

        setStartDate(Auth.user.is_admin);
      }
      
      // start loader
      if(Auth.user.idToken){
        getData();
      }

      $scope.$on('user:updated', function (event, data) {
        if(Auth.user.idToken){
          getData();
        }
      });

      self.submitDonation = function() {
        if(verbose) {console.log("Submitting newDonation", self.newDonation); }

        self.newDonation.saving = true;

        DonationsFactory.submitDonations(self.newDonation)
          .then(function (result) {
            self.newDonation.saving = false;
            // toastr.success('Donation Submitted');
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

        donation.saving = true;

        DonationsFactory.editDonations(donation)
          .then(function (result) {
            donation.saving = false;
          })
          .catch(function (err) {
            donation.saving = false;
            donation.editable = false;
          });
      };

      self.deleteDonation = function(donation) {
        if(verbose) {console.log("deleting"); }

        var confirm = ConfirmFactory.confirm('sm', {action: 'Delete', type: 'Donation', item: donation});

        confirm.result.then(function (config) {
          donation.saving = true;
          DonationsFactory.deleteDonations(donation)
            .then(function (result) {
              donation.saving = false;
            })
            .catch(function (err) {
              donation.saving = false;
            });
        })
          .catch(function (err) {
          });
      };

      function packageParams() {
        return {
          start_date: $scope.daterange.start,
          end_date: $scope.daterange.end,
          org_type: 'food_rescue',
          contact_id: self.contact_id
        };
      }

      self.getCsv = function () {
        var params = packageParams();
        DonationsFactory.getCsv(params);
      }

      self.toggleEditable = function (donation) {
        if(donation.editable) {
          donation.editable = false;
        } else {
          donation.editable = true;
        }
      };

    }]);
