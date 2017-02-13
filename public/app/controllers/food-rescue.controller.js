app.controller("FoodRescueController",
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 'dateRangeFilter', 'mergeCategoriesFilter', 'ConfirmFactory', 'toastr', 'DateRangeFactory',
    function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q, dateRangeFilter, mergeCategoriesFilter, ConfirmFactory, toastr, DateRangeFactory){

      var self = this;
      var verbose = true;

      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      };

      self.rescueCategories = CategoryFactory.categories;
      self.rescueContacts = ContactsFactory.contacts;
      self.rescueDonations = DonationsFactory.donations;
      self.user = Auth.user;

      $scope.daterange = DateRangeFactory.daterange;

      if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
        self.gotData = true;
      } else {
        self.gotData = false;
      }

      function getData() {
        var queryRange = DateRangeFactory.getQueryRange(Auth.user.is_admin);
        var params = {
          start_date: queryRange.start,
          end_date: queryRange.end,
        };

        $scope.filterProp = selectFilter(Auth.user.is_admin);

        $q.all([
          DonationsFactory.getDonations(params),
          ContactsFactory.getContacts()
        ])
          .then(function (response) {
            DistributionFactory.getDistributions(params);
            self.gotData = true;
          });
      }

      function selectFilter(is_admin) {
        var filter = 'donation_entered';
        if(is_admin) {
          filter = 'timestamp';
        }
        return filter;
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

      $scope.$watchCollection('daterange', getData);

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
        var queryRange = DateRangeFactory.getQueryRange();
        return {
          start_date: queryRange.start,
          end_date: queryRange.end,
          org_type: 'food_rescue',
          contact_id: self.contact_id
        };
      }

      self.getCsv = function () {
        var params = packageParams();
        DonationsFactory.getCsv(params);
      };

      self.toggleEditable = function (donation) {
        if(donation.editable) {
          donation.editable = false;
        } else {
          donation.editable = true;
        }
      };

  self.valueCheck = function () {
    if(hasOne(self.newDonation.categories)) {
      return false;
    } else {
      return true;
    }
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
