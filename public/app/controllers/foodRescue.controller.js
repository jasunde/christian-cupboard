app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', 'DonationsFactory', function($scope, Auth, CategoryFactory, DonationsFactory){
  var self = this;
  self.rescueCategories = CategoryFactory.categories;
  self.rescueDonations = DonationsFactory.donations;
  console.log(self.rescueDonations);


  CategoryFactory.getCategories();
  DonationsFactory.getDonations();

  $scope.$on('user:updated', function (event, data) {
      CategoryFactory.getCategories();
      DonationsFactory.getDonations();
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
