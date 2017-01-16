app.controller("FoodDriveController", ['DonationsFactory', 'CategoryFactory', 'ContactsFactory', '$scope', 'Auth', function(DonationsFactory, CategoryFactory, ContactsFactory, $scope, Auth){

    var self = this;
    var verbose = true;

    self.newDonation = {
      contact_id: undefined,
      timestamp: new Date(),
    };

    self.thisDonation = {};

    self.driveCategories = CategoryFactory.categories;
    self.driveContacts = ContactsFactory.contacts;
    self.driveDonations = DonationsFactory.donations;

    ContactsFactory.getContacts();
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
        if(verbose) {console.log("editing", donation);
      }
        DonationsFactory.editDonations(donation);
    };
    self.toggleEditable = function (donation) {
      if(donation.editable) {
        donation.editable = false;
      } else {
        donation.editable = true;
      }
    };

    self.deleteDonation = function(donation) {
        if(verbose) {console.log("deleting");
      }
        DonationsFactory.deleteDonations(donation);
    };
  }]);
