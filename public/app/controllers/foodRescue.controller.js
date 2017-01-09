app.controller("FoodRescueController", ["$http", "FoodRescueFactory", function($http, FoodRescueFactory){
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
