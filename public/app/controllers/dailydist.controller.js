app.controller("DailyDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory){
  var self = this;
  var verbose = true;

  self.dailyDist = {
    first_name: "John",
    last_name: "Monday",
	  timestamp: "Tue Jan 10 2017 18:24:32",
	  categories: {
		  18: 26,
		  19: 308
	}
}

self.dailyDistributionCategories = CategoryFactory.categories;

if (verbose) {console.log(self.dailyDistributionCategories);}



}]);
