app.controller("DailyDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory){
  var self = this;
  var verbose = false;
  var distribution = {};
  self.newDistribution = {};

  self.dailyDist = [
    {first_name: "John",
    last_name: "Monday",
	  timestamp: "Tue Jan 10 2017 18:24:32",
    family_size: 3,
    editable: false,
	  categories: {
		  18: 26,
		  19: 308,
      24: 100
	}
}];

DistributionFactory.getDistributions();

self.dailyDistributionCategories = CategoryFactory.categories;
self.dailyDistributionContacts = ContactsFactory.contacts;
self.dailyDistributionDonations = DonationsFactory.donations;
self.dailyDistributions = DistributionFactory.distributions;


if (verbose) {console.log("This be the distributions", self.dailyDistributions);}

self.addDistribution = function () {
  console.log(self.newDistribution);
  self.newDistribution.saving = true;
  DistributionFactory.addDistribution(self.newDistribution)
  .then(function (result) {
    self.newDistribution = {};
    self.newDistribution.saving = false;
  });
};

self.toggleEditable = function (distribution) {
  if(distribution.editable) {
    distribution.editable = false;
  } else {
    distribution.editable = true;
  }
};

self.updateDistribution = function(donation) {
    if(verbose) {console.log("editing", donation);
  }
    DistributionFactory.updateDistribution(distribution);
};

// self.updateDistribution = function () {
//   console.log("clicking");
//   distribution.saving = true;
//   DistributionFactory.updateDistribution(distribution)
//   .then(function (result) {
//     distribution.saving = false;
//     distribution = {};
//   });
// };


}]);
