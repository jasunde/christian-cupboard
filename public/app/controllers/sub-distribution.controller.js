app.controller("SubDistributionController", 
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 'ConfirmFactory', 'DateRangeFactory',
    function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q, ConfirmFactory, DateRangeFactory){
      var self = this;
      var verbose = true;

      self.newSubDistribution = {
        timestamp: new Date()
      };

      self.subDistributionCategories = CategoryFactory.categories;
      self.subDistributions = DistributionFactory.distributions;
      self.contacts = ContactsFactory.contacts;
      self.user = Auth.user;

      $scope.daterange = DateRangeFactory.daterange;

      if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DistributionFactory.distributions.list) {
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
          DistributionFactory.getDistributions(params),
          ContactsFactory.getContacts()
        ])
          .then(function (response) {
            DonationsFactory.getDonations(params);
            self.gotData = true;
            console.log('got data', DistributionFactory.distributions);
          });
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

      self.addSubDistribution = function () {
        self.newSubDistribution.saving = true;
        DistributionFactory.addDistribution(self.newSubDistribution)
          .then(function (result) {
            self.newSubDistribution = {
              timestamp: new Date()
            };
            self.newSubDistribution.saving = false;
          })
          .catch(function (err) {
            self.newSubDistribution.saving = false;
          });
      };

      self.toggleEditable = function (subDistribution) {
        if(subDistribution.editable) {
          subDistribution.editable = false;
        } else {
          subDistribution.editable = true;
        }
      };

      self.updateSubDistribution = function (subDistribution) {
        console.log("clicking");
        subDistribution.saving = true;
        DistributionFactory.updateDistribution(subDistribution)
          .then(function (result) {
            subDistribution.saving = false;
            subDistribution.editable = false;
            subDistribution = {
              timestamp: new Date()
            };
          })
          .catch(function (err) {
            subDistribution.saving = false;
            subDistribution.editable = false;
          });
      };

      self.delete = function (item) {
        var confirm = ConfirmFactory.confirm('sm', {action: 'Delete', type: 'Distribution', item: item});

        confirm.result.then(function (config) {
          item.saving = true;
          DistributionFactory.deleteDistribution(item)
            .then(function (result) {
              item.saving = false;
            })
            .catch(function (err) {
              item.saving = false;
            });
        })
          .catch(function (err) {
          });
      }

      function packageParams() {
        return {
          start_date: $scope.daterange.start,
          end_date: $scope.daterange.end,
          org_type: 'sub_distribution',
          contact_id: self.org_id
        };
      }

      self.getCsv = function() {
        var params = packageParams();
        DistributionFactory.getCsv(params)
      }


      self.valueCheck = function () {
        if(hasOne(self.newSubDistribution.categories)) {
          return false;
        } else {
          return true;
        }
      }

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
