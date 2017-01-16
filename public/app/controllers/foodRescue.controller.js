app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory){

  var self = this;
  var verbose = true;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
    // categories: CategoryFactory.categories.map
  }

  self.thisDonation = {};

  self.rescueCategories = CategoryFactory.categories;
  self.rescueContacts = ContactsFactory.contacts;
  self.rescueDonations = DonationsFactory.donations;

  // CategoryFactory.gepublic/app/services/category.factory.jstCategories();
  ContactsFactory.getContacts();
  DonationsFactory.getDonations();

  $scope.$on('user:updated', function (event, data) {
      // CategoryFactory.getCategories();
      DonationsFactory.getDonations();
      ContactsFactory.getContacts();
  });

  self.submitDonation = function() {
      if(verbose) {console.log("Submitting newDonation", self.newDonation)};
      DonationsFactory.submitDonations(self.newDonation)
      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      }
  }

  self.editDonation = function(donation) {
      if(verbose) {console.log("editing", donation)};
      DonationsFactory.editDonations(donation);
  }

  self.deleteDonation = function(donation) {
      if(verbose) {console.log("deleting", donation)};
      DonationsFactory.deleteDonations(donation)
  }

//utility functions
//adding current time to scope, possibly helpful for filtering results by today's date.
  var now = new Date().getTime();
    $scope.date = new Date(2015, 10, 10);
    $scope.ago = now < $scope.date.getTime();
    $scope.before = now > $scope.date.getTime();

    var myVar;

self.myFunction = function() {
    myVar = setTimeout(showPage, 3000);
}

function showPage() {
  angular.element( document.querySelector("loader").style.display = "none");
  angular.element( document.querySelector("myDiv").style.display = "block");
  // angular.element("loader").style.display = "none";
  // angular.element("myDiv").style.display = "block";
}

self.toggleEditable = function (donation) {
  if(donation.editable) {
    donation.editable = false;
  } else {
    donation.editable = true;
  }
};

}]);
