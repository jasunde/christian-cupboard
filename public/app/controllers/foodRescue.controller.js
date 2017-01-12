app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', function($scope, Auth, CategoryFactory){
  var verbose = true;
  var self = this;
  self.rescueCategories = CategoryFactory.categories;

  $scope.$on('user:updated', function (event, data) {
    if(verbose) {console.log('user updated');}

    if(Auth.user.currentUser) {
      if(verbose) {console.log('getting categories')}
      CategoryFactory.getCategories();
    }
  });

  //get the categories
  // $scope.$on('user:updated', function (event, data) {
  //   console.log('user:updated:', event, data);
  //   FoodRescueFactory.getCategories();
  // })
  // self.rescueCategories = FoodRescueFactory.categories;
  // console.log("Categories for table", self.rescueCategories);

  // get organizations
  // FoodRescueFactory.getOrganizations();
  // self.rescueCategories = FoodRescueFactory.organizations();
  // console.log("Organizations for table", self.rescueOrganizations);

}]);
