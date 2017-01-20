app.controller("FoodDriveController", ['DonationsFactory', 'CategoryFactory', 'ContactsFactory', '$scope', 'Auth', '$q', 'dateRangeFilter', function(DonationsFactory, CategoryFactory, ContactsFactory, $scope, Auth, $q, dateRangeFilter){
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
    console.log(self.driveContacts);

    if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DonationsFactory.donations.list) {
      self.gotData = true;
    } else {
      self.gotData = false;
    }

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

    // // ContactsFactory.getContacts();
    // DonationsFactory.getDonations();
    //
    // $scope.$on('user:updated', function (event, data) {
    //     CategoryFactory.getCategories();
    //     DonationsFactory.getDonations();
    // });

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
  }]);
