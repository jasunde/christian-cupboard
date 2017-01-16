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

  self.add = function() {
      if(verbose) {console.log("Submitting newDonation", self.newDonation);
    }
      FoodDriveFactory.addDonation(self.newDonation);
      self.newDonation = {
        contact_id: undefined,
        timestamp: new Date(),
      };
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
