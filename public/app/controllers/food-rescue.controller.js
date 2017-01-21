app.controller("FoodRescueController",
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 'dateRangeFilter', 'mergeCategoriesFilter',
  function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q, dateRangeFilter, mergeCategoriesFilter){

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
  self.user = Auth.user;

  console.log(self.rescueDonations);


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
//adding current time to scope, possibly helpful for filtering results by date.

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
    dd='0'+dd
}
if(mm<10) {
    mm='0'+mm
}
today = mm+'/'+dd+'/'+yyyy;


  var now = new Date().getTime();
    $scope.date = new Date(2015, 10, 10);
    $scope.ago = now < $scope.date.getTime();
    $scope.before = now > $scope.date.getTime();
$scope.daterange = {
  start: new Date(today),
  end: new Date(today)
};
    // $scope.dateRange = dateRangeFilter(date, $scope.startDate, $scope.endDate)

    self.toggleEditable = function (donation) {
      if(donation.editable) {
        donation.editable = false;
      } else {
        donation.editable = true;
      }
    };

}]);
