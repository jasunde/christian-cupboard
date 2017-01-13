app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory){

  var self = this;
  var verbose = true;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
    // categories: CategoryFactory.categories.map
  }

  self.rescueCategories = CategoryFactory.categories;
  self.rescueContacts = ContactsFactory.contacts;
  self.rescueDonations = DonationsFactory.donations;
  if(verbose){console.log("Rescue Contacts from Factory", self.rescueContacts)};


  CategoryFactory.getCategories();
  ContactsFactory.getContacts();
  DonationsFactory.getDonations();

  $scope.$on('user:updated', function (event, data) {
      CategoryFactory.getCategories();
      DonationsFactory.getDonations();
  });

  self.submitDonation = function() {
      if(verbose) {console.log("Submitting newDonation", self.newDonation)};
      DonationsFactory.submitDonations(self.newDonation)
  }

  self.editDonation = function() {
      if(verbose) {console.log("editing")};
  }

  self.deleteDonation = function() {
      if(verbose) {console.log("deleting")};
  }


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

//utility functions
//adding current time to scope, possibly helpful for filtering results by today's date.
  var now = new Date().getTime();
    $scope.date = new Date(2015, 10, 10);
    $scope.ago = now < $scope.date.getTime();
    $scope.before = now > $scope.date.getTime();

}]);
