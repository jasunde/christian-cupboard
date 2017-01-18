app.controller("SubDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory){
  var self = this;
  var verbose = true;

  self.newSubDistribution = {
    timestamp: new Date()
  };

  self.subDistributionCategories = CategoryFactory.categories;
  self.subDistributions = DistributionFactory.distributions;

  if(Auth.user.idToken) {
    DistributionFactory.getDistributions();
  }

  $scope.$on('user:updated', function () {
    DistributionFactory.getDistributions();
  })

  console.log("More dists", self.subDistributions);

  self.addSubDistribution = function () {
    self.newSubDistribution.saving = true;
    DistributionFactory.addDistribution(self.newSubDistribution)
    .then(function (result) {
      self.newSubDistribution = {};
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
      var index = DistributionFactory.distributions.list.findIndex(function (dist) {
        return dist.distribution_id == subDistribution.distribution_id;
      })
      DistributionFactory.distributions.list[index] = subDistribution;
      subDistribution.saving = false;
      subDistribution.editable = false;
      subDistribution = {
        timestamp: new Date()
      };
    });
  };

  self.delete = function (item) {
    item.saving = true;

    DistributionFactory.deleteDistribution(item)
    .then(function (result) {
      DistributionFactory.distributions.list = DistributionFactory.distributions.list.filter(function (dist) {
        return dist.distribution_id != item.distribution_id;
      });
    })
  }

}]);
