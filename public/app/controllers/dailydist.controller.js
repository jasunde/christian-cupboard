app.controller("DailyDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory){
  var self = this;
  var verbose = true;
  self.newDistibution = {};

  self.dailyDist = [

    {first_name: "John",
    last_name: "Monday",
	  timestamp: "Tue Jan 10 2017 18:24:32",
    family_size: 3,
	  categories: {
		  18: 26,
		  19: 308,
      24: 100
	}
}
];


DistributionFactory.getDistributions();
self.dailyDistributionCategories = CategoryFactory.categories;
if (verbose) {console.log(self.dailyDist);}




}]);
