app.controller("DailyDistributionController", ['$scope', 'Auth', 'DistributionFactory', 'CategoryFactory', '$scope', function($scope, Auth, DistributionFactory, CategoryFactory, $scope){
  var self = this;
  var verbose = false;
  var distribution = {};
  self.newDistribution = {};

  self.dailyDistributions = DistributionFactory.distributions;
  self.categories = CategoryFactory.categories;

  if(Auth.user.idToken) {
    DistributionFactory.getDistributions();
  }

  $scope.$on('user:updated', function () {
    DistributionFactory.getDistributions();
  });

  if (verbose) {console.log("This be the distributions", self.dailyDistributions);}

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
        DistributionFactory.distributions.list.push(self.newDistribution);
        self.newDistribution = {};
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
      });
  };

  self.deleteDistribution = function (distribution) {
    console.log('deleting');
    distribution.saving = true;

    DistributionFactory.deleteDistribution(distribution)
      .then(function (result) {
        DistributionFactory.distributions.list = DistributionFactory.distributions.list.filter(function (dist) {
          return dist.distribution_id != distribution.distribution_id;
        })
        distribution.saving = false;
      });
  };

}]);
