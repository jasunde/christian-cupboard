app.controller("SubDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory){
  var self = this;
  var verbose = true;

  self.newSubDistribution = {};

  DistributionFactory.getDistributions();

  self.subDistributionCategories = CategoryFactory.categories;
  self.subDistributionContacts = ContactsFactory.contacts;
  self.subDistributionDonations = DonationsFactory.donations;
  self.subDistributions = DistributionFactory.distributions;

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

  self.updateSubDistribution = function () {
    console.log("clicking");
    subDistribution.saving = true;
    DistributionFactory.update(subDistribution)
    .then(function (result) {
      subDistribution.saving = false;
      subDistribution = {};
    });
  };



}]);
