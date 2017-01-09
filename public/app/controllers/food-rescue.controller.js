app.controller("foodRescueController", ["$http", "FoodRescueFactory", function($http, FoodRescueFactory){
  var self = this;
  self.rescueCategories = {};

//get the categories
  FoodRescueFactory.getCategories();
  self.rescueCategories = FoodRescueFactory.categories();
  console.log("Categories for table", self.rescueCategories);

}]);
