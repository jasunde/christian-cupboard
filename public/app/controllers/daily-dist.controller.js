app.controller("DailyDistributionController", 
  ['$scope', 'Auth', 'DonationsFactory', 'DistributionFactory', 'CategoryFactory', '$scope', '$q', 'ConfirmFactory',
  function($scope, Auth, DonationsFactory, DistributionFactory, CategoryFactory, $scope, $q, ConfirmFactory){

  var self = this;
  var verbose = false;
  var distribution = {};
  self.newDistribution = {};
  self.newDistribution.timestamp = new Date();

  self.dailyDistributions = DistributionFactory.distributions;
  self.categories = CategoryFactory.categories;
  self.user = Auth.user;
  console.log(self.categories);

if(CategoryFactory.categories.list && DistributionFactory.distributions.list) {
  self.gotData = true;
} else {
  self.gotData = false;
}

// start loader
if(Auth.user.idToken){
  $q.all([
    DistributionFactory.getDistributions()
  ])
  .then(function (response) {
    DonationsFactory.getDonations();
    self.gotData = true;
  });
}

$scope.$on('user:updated', function (event, data) {

  if(Auth.user.idToken){
    $q.all([
      DistributionFactory.getDistributions()
    ])
    .then(function (response) {
      DonationsFactory.getDonations();
      self.gotData = true;
    });
  }
});

  self.toggleEditable = function (distribution) {
    if(distribution.editable) {
      distribution.editable = false;
    } else {
      distribution.editable = true;
    }
  };

  self.addDistribution = function () {
    if(verbose) {console.log(self.newDistribution);}
    console.log('adding');
    self.newDistribution.saving = true;
    DistributionFactory.addDistribution(self.newDistribution)
      .then(function (result) {
        self.newDistribution = {};
        self.newDistribution.saving = false;
      })
      .catch(function (err) {
        self.newDistribution.saving = false;
      });
  };

  self.updateDistribution = function (distribution) {
    console.log('distribution', distribution);
    distribution.saving = true;
    DistributionFactory.updateDistribution(distribution)
      .then(function (result) {
        distribution.saving = false;
        distribution.editable = false;
      })
      .catch(function (err) {
        distribution.saving = false;
        distribution.editable = false;
      });
  };

    self.deleteDistribution = function (distribution) {
      if(verbose) {console.log('deleting');}

      var confirm = ConfirmFactory.confirm('sm', {action: 'Delete', type: 'Distribution', item: distribution});

      confirm.result
        .then(function (config) {
        distribution.saving = true;

        DistributionFactory.deleteDistribution(distribution)
          .then(function (result) {
            distribution.saving = false;
          });
        })
        .catch(function (err) {

        });
    };

  self.getCsv = function() {
    DistributionFactory.getCsv()
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
