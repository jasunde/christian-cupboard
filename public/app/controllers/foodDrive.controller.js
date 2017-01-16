app.controller("FoodDriveController", ['$scope', 'Auth', 'CategoryFactory', 'FoodDriveFactory', function($scope, Auth, CategoryFactory, FoodDriveFactory){


  var self = this;
  var verbose = true;

  self.newDonation = {
    contact_id: undefined,
    timestamp: new Date(),
  };

  self.driveCategories = CategoryFactory.categories;

  $scope.$on('user:updated', function (event, data) {
    CategoryFactory.getCategories();
    FoodDriveFactory.getDonations();
  });

  self.driveDonations = FoodDriveFactory.donations;

  self.add = function () {
    self.newDonation.saving = true;

    FoodDriveFactory.addDonation(self.newDonation)
    .then(function (result) {
      self.newDonation = {};
      self.newDonation.saving = false;
    });
  };

  self.toggleEditable = function (donation) {
    if(donation.editable) {
      donation.editable = false;
    } else {
      donation.editable = true;
    }
  };

  self.update = function (donation) {
    donation.saving = true;

    FoodDriveFactory.updateDonation(donation)
      .then(function (result) {
        donation.saving = false;
      });
  };

}]);
