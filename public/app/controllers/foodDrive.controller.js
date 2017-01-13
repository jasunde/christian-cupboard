app.controller("FoodDriveController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory){
  

  var self = this;
  var verbose = true;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
  }

  self.thisDonation = {};

//   self.rescueCategories = CategoryFactory.categories;
  self.rescueContacts = ContactsFactory.contacts;
  self.rescueDonations = DonationsFactory.donations;

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
      if(verbose) {console.log("deleting")};
      DonationsFactory.deleteDonations(donation)
  }

}]);
