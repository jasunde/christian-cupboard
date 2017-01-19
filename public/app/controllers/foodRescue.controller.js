app.controller("FoodRescueController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', '$q', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, $q){

  var self = this;
  var verbose = true;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
  };

  self.thisDonation = {};

  self.rescueCategories = CategoryFactory.categories;
  self.rescueContacts = ContactsFactory.contacts;
  self.rescueDonations = DonationsFactory.donations;
  console.log(self.rescueContacts);

  if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
    self.gotData = true;
  } else {
    self.gotData = false;
  }

  // start loader
  if(Auth.user.idToken){
    $q.all([
      CategoryFactory.getCategories(),
      DonationsFactory.getDonations(),
      ContactsFactory.getContacts()
    ])
    .then(function (response) {
      self.gotData = true;
    });
}

  $scope.$on('user:updated', function (event, data) {

    if(Auth.user.idToken){
      $q.all([
        CategoryFactory.getCategories(),
        DonationsFactory.getDonations(),
        ContactsFactory.getContacts()
      ])
      .then(function (response) {
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


//custom Food Rescue Admin Filters

  self.search = '';
  self.donor_type = '';
  self.ind_type = '';
  self.filter = {
  }

  self.ind_types = [{
    name: '',
    filter:  {}
  }, {
    name: 'All',
    filter: {org: false}

  }, {
    name: 'Client',
    filter: {donor: false, org: false}

  }, {
    name: 'Donor',
    filter: {donor: true, org: false}

  }];

  self.changeFilter = function (filter) {
    self.filter
  }

}]);
