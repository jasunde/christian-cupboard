app.controller("SubDistributionController", ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q){
  var self = this;
  var verbose = true;

  self.newSubDistribution = {};

  self.subDistributionCategories = CategoryFactory.categories;
  self.subDistributionContacts = ContactsFactory.contacts;
  self.subDistributionDonations = DonationsFactory.donations;
  self.subDistributions = DistributionFactory.distributions;

  if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list && DistributionFactory.distributions.list) {
    self.gotData = true;
  } else {
    self.gotData = false;
  }

  // start loader
  if(Auth.user.idToken){
    $q.all([
      CategoryFactory.getCategories(),
      DonationsFactory.getDonations(),
      ContactsFactory.getContacts(),
      DistributionFactory.getDistributions()
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
        ContactsFactory.getContacts(),
        DistributionFactory.getDistributions()
      ])
      .then(function (response) {
        self.gotData = true;
      });
    }
  });



  console.log("More dists", self.subDistributions);

  self.addSubDistribution = function () {
    self.newSubDistribution.saving = true;
    DistributionFactory.addDistribution(self.newSubDistribution)
    .then(function (result) {
      self.newSubDistribution = {};
      self.newSubDistribution.saving = false;
    });
  };

  self.toggleEditable = function (subDistribution) {
    if(subDistribution.editable) {
      subDistribution.editable = false;
    } else {
      subDistribution.editable = true;
    }
  };

  self.updateSubDistribution = function () {
    console.log("clicking");
    subDistribution.saving = true;
    DistributionFactory.update(subDistribution)
    .then(function (result) {
      subDistribution.saving = false;
      subDistribution = {};
    });
  };



}]);
