app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', function($scope, Auth, CategoryFactory){
  var verbose = true;
  var self = this;
  self.rescueCategories = CategoryFactory.categories;

  // get organizations
  // FoodRescueFactory.getOrganizations();
  // self.rescueCategories = FoodRescueFactory.organizations();
  // console.log("Organizations for table", self.rescueOrganizations);

}]);
