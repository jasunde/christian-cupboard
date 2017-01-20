app.controller("SubDistributionController", 
  ['$scope', 'Auth', 'CategoryFactory', 'ContactsFactory', 'DonationsFactory', 'DistributionFactory', '$q', 
  function($scope, Auth, CategoryFactory, ContactsFactory, DonationsFactory, DistributionFactory, $q){
  var self = this;
  var verbose = true;

  self.newSubDistribution = {
    timestamp: new Date()
  };

  self.subDistributionCategories = CategoryFactory.categories;
  self.subDistributions = DistributionFactory.distributions;
  self.contacts = ContactsFactory.contacts;
  self.user = Auth.user;

  if(Auth.user.idToken) {
    DistributionFactory.getDistributions();
    ContactsFactory.getContacts();
  }

  $scope.$on('user:updated', function () {
    DistributionFactory.getDistributions();
    ContactsFactory.getContacts();
  })

  if(CategoryFactory.categories.list && ContactsFactory.contacts.list && DistributionFactory.distributions.list) {
    self.gotData = true;
  } else {
    self.gotData = false;
  }

  // start loader
  if(Auth.user.idToken){
    $q.all([
      DistributionFactory.getDistributions(),
      ContactsFactory.getContacts()
    ])
    .then(function (response) {
      DonationsFactory.getDonations();
      self.gotData = true;
    });
}

  $scope.$on('user:updated', function (event, data) {

    if(Auth.user.idToken){
      $q.all([
        ContactsFactory.getContacts(),
        DistributionFactory.getDistributions()
      ])
      .then(function (response) {
        self.gotData = true;
        DonationsFactory.getDonations();
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
    })
    .catch(function (err) {
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

  self.updateSubDistribution = function (subDistribution) {
    console.log("clicking");
    subDistribution.saving = true;
    DistributionFactory.updateDistribution(subDistribution)
    .then(function (result) {
      var index = DistributionFactory.distributions.list.findIndex(function (dist) {
        return dist.distribution_id == subDistribution.distribution_id;
      })
      DistributionFactory.distributions.list[index] = subDistribution;
      subDistribution.saving = false;
      subDistribution.editable = false;
      subDistribution = {
        timestamp: new Date()
      };
    });
  };

  self.delete = function (item) {
    item.saving = true;
    DistributionFactory.deleteDistribution(item)
    .then(function (result) {
      DistributionFactory.distributions.list = DistributionFactory.distributions.list.filter(function (dist) {
        return dist.distribution_id != item.distribution_id;
      });
        item.saving = false;
    })
  }

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

  }]);