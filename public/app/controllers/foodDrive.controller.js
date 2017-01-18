app.controller("FoodDriveController", ['DonationsFactory', 'CategoryFactory', 'ContactsFactory', '$scope', function(DonationsFactory, CategoryFactory, ContactsFactory, $scope){
    var self = this;
    var verbose = true;

    self.newDonation = {
      contact_id: undefined,
      timestamp: new Date(),
    };

    self.thisDonation = {};

    self.driveCategories = CategoryFactory.categories;
    self.driveDonations = DonationsFactory.donations;

    // ContactsFactory.getContacts();
    DonationsFactory.getDonations();

    $scope.$on('user:updated', function (event, data) {
        CategoryFactory.getCategories();
        DonationsFactory.getDonations();
    });

    self.submitDonation = function() {
        if(verbose) {console.log("Submitting newDonation", self.newDonation);
      }
        DonationsFactory.submitDonations(self.newDonation);
        self.newDonation = {
          contact_id: undefined,
          timestamp: new Date(),
        };
    };

    self.editDonation = function(donation) {
        if(verbose) {console.log("editing", donation); }

        donation.saving=true;

        DonationsFactory.editDonations(donation)
        .then(function (result){
          donation.saving=false;
        });
    };

    self.deleteDonation = function(donation) {
        if(verbose) {console.log("deleting");
      }

      donation.saving=true;

        DonationsFactory.deleteDonations(donation)
        .then(function (result){
          donation.saving=false;
        });
    };

      self.toggleEditable = function (donation) {
      if(donation.editable) {
        donation.editable = false;
      } else {
        donation.editable = true;
      }
    };

    self.getCsv = function(){
      DonationsFactory.getCsv()
    }

  }]);
