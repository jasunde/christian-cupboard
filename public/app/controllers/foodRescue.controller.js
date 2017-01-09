app.controller("FoodRescueController", ["$firebaseAuth", "$http", "FoodRescueFactory", function( $firebaseAuth, $http, FoodRescueFactory){
  var self = this;
  self.rescueCategories = {};

//get the categories
  FoodRescueFactory.getCategories();
  self.rescueCategories = FoodRescueFactory.categories();
  console.log("Categories for table", self.rescueCategories);

// get organizations
  // FoodRescueFactory.getOrganizations();
  // self.rescueCategories = FoodRescueFactory.organizations();
  // console.log("Organizations for table", self.rescueOrganizations);

}]);
