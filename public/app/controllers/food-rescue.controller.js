app.controller("FoodRescueController", 
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 'mergeCategoriesFilter',
  function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q, mergeCategoriesFilter){

  var self = this;
  var verbose = false;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
  };

  self.thisDonation = {};

  self.rescueCategories = CategoryFactory.categories;
  self.rescueContacts = ContactsFactory.contacts;
  self.rescueDonations = DonationsFactory.donations;


  if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
    self.gotData = true;
  } else {
    self.gotData = false;
  }

  // start loader
  if(Auth.user.idToken){
    $q.all([
      DonationsFactory.getDonations(),
      ContactsFactory.getContacts()
    ])
    .then(function (response) {
      DistributionFactory.getDistributions();
      self.gotData = true;
    });
}

  $scope.$on('user:updated', function (event, data) {

    if(Auth.user.idToken){
      $q.all([
        DonationsFactory.getDonations(),
        ContactsFactory.getContacts()
      ])
      .then(function (response) {
        DistributionFactory.getDistributions();
        self.gotData = true;
      });
    }
  });

  self.submitDonation = function() {
    if(verbose) {console.log("Submitting newDonation", self.newDonation); }

    self.newDonation.saving = true;

    DonationsFactory.submitDonations(self.newDonation)
      .then(function (result) {
        self.newDonation.saving = false;

        self.newDonation = {
          contact_id: undefined,
          timestamp: new Date(),
        };
      });

  };

  self.editDonation = function(donation) {
    if(verbose) {console.log("editing", donation); }

    donation.saving = true;

    DonationsFactory.editDonations(donation)
      .then(function (result) {
        donation.saving = false;
      });
  };

  self.deleteDonation = function(donation) {
    if(verbose) {console.log("deleting"); }

    donation.saving = true;

    DonationsFactory.deleteDonations(donation)
      .then(function (result) {
        donation.saving = false;
      });
  };

//utility functions
//adding current time to scope, possibly helpful for filtering results by today's date.
  var now = new Date().getTime();
    $scope.date = new Date(2015, 10, 10);
    $scope.ago = now < $scope.date.getTime();
    $scope.before = now > $scope.date.getTime();

    self.toggleEditable = function (donation) {
      if(donation.editable) {
        donation.editable = false;
      } else {
        donation.editable = true;
      }
    };

}]);
