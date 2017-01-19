app.controller("DailyDistributionController", ['$scope', 'Auth', 'DonationsFactory', 'DistributionFactory', 'CategoryFactory', '$scope', '$q', function($scope, Auth, DonationsFactory, DistributionFactory, CategoryFactory, $scope, $q){

  var self = this;
  var verbose = false;
  var callInProgress = false;
  var distribution = {};
  self.newDistribution = {};

  self.dailyDistributions = DistributionFactory.distributions;
  self.categories = CategoryFactory.categories;

if(CategoryFactory.categories.list && DistributionFactory.distributions.list) {
  self.gotData = true;
} else {
  self.gotData = false;
}

// start loader
if(Auth.user.idToken){
  if(!callInProgress) {
    callInProgress = true;
  DistributionFactory.getDistributions()
  .then(function (response) {
    DonationsFactory.getDonations();
    callInProgress = false;
    self.gotData = true;
  });
  }
}

$scope.$on('user:updated', function (event, data) {

  if(Auth.user.idToken){
    if(!callInProgress) {
      callInProgress = true;
      DistributionFactory.getDistributions()
      .then(function (response) {
        DonationsFactory.getDonations();
        callInProgress = false;
        self.gotData = true;
      });
    }
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
