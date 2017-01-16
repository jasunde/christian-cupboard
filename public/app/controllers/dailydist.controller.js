app.controller("DailyDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', function(){
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



if (verbose) {console.log(self.dailyDist);}

}]);
