app.controller("DailyDistributionController", 
  ['$scope', 'Auth', 'DonationsFactory', 'DistributionFactory', 'CategoryFactory', '$scope', '$q', 'ConfirmFactory', 'DateRangeFactory',
    function($scope, Auth, DonationsFactory, DistributionFactory, CategoryFactory, $scope, $q, ConfirmFactory, DateRangeFactory){

      var self = this;
      var verbose = false;
      var distribution = {};
      self.newDistribution = {
        timestamp: new Date()
      };

      self.dailyDistributions = DistributionFactory.distributions;
      self.categories = CategoryFactory.categories;
      self.user = Auth.user;

      $scope.daterange = DateRangeFactory.daterange;

      if(CategoryFactory.categories.list && DistributionFactory.distributions.list) {
        self.gotData = true;
      } else {
        self.gotData = false;
      }

      function getData() {
        var params = {
          start_date: DateRangeFactory.start,
          end_date: DateRangeFactory.end
        };

        $q.all([
          DistributionFactory.getDistributions(params)
        ])
          .then(function (response) {
            DonationsFactory.getDonations(params);
            self.gotData = true;
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

      self.toggleEditable = function (distribution) {
        if(distribution.editable) {
          distribution.editable = false;
        } else {
          distribution.editable = true;
        }
      };

      self.addDistribution = function () {
        if(verbose) {console.log(self.newDistribution);}
        console.log('adding');
        self.newDistribution.saving = true;
        DistributionFactory.addDistribution(self.newDistribution)
          .then(function (result) {
            self.newDistribution = {
              timestamp: new Date()
            };
            self.newDistribution.saving = false;
          })
          .catch(function (err) {
            self.newDistribution.saving = false;
          });
      };

      self.updateDistribution = function (distribution) {
        console.log('distribution', distribution);
        distribution.saving = true;
        DistributionFactory.updateDistribution(distribution)
          .then(function (result) {
            distribution.saving = false;
            distribution.editable = false;
          })
          .catch(function (err) {
            distribution.saving = false;
            distribution.editable = false;
          });
      };

      self.deleteDistribution = function (distribution) {
        if(verbose) {console.log('deleting');}

        var confirm = ConfirmFactory.confirm('sm', {action: 'Delete', type: 'Distribution', item: distribution});

        confirm.result
          .then(function (config) {
            distribution.saving = true;

            DistributionFactory.deleteDistribution(distribution)
              .then(function (result) {
                distribution.saving = false;
              });
          })
          .catch(function (err) {

          });
      };

      function packageParams() {
        return {
          start_date: $scope.daterange.start,
          end_date: $scope.daterange.end,
          org_type: '!sub_distribution',
          contact_id: self.org_id
        };
      }

      self.getCsv = function() {
        var params = packageParams();
        DistributionFactory.getCsv(params);
      }

  self.valueCheck = function () {
    if(hasOne(self.newDistribution.categories)) {
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
