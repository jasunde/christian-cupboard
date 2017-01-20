app.controller("DailyDistributionController", ['$scope', 'Auth', 'DistributionFactory', 'CategoryFactory', '$scope', '$q', function($scope, Auth, DistributionFactory, CategoryFactory, $scope, $q){

  var self = this;
  var verbose = false;
  var distribution = {};
  self.newDistribution = {};

  self.dailyDistributions = DistributionFactory.distributions;
  self.categories = CategoryFactory.categories;

if(CategoryFactory.categories.list && DistributionFactory.distributions.list) {
  self.gotData = true;
} else {
  self.gotData = false;
}

// start loader
if(Auth.user.idToken){
  $q.all([
    CategoryFactory.getCategories(),
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
      DistributionFactory.getDistributions()
    ])
    .then(function (response) {
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
        DistributionFactory.distributions.list.push(self.newDistribution);
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
      });
  };

  self.deleteDistribution = function (distribution) {
    console.log('deleting');
    distribution.saving = true;

    DistributionFactory.deleteDistribution(distribution)
      .then(function (result) {
        DistributionFactory.distributions.list = DistributionFactory.distributions.list.filter(function (dist) {
          return dist.distribution_id != distribution.distribution_id;
        })
        distribution.saving = false;
      });
  };

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
      $scope.startDate = new Date(today);
      $scope.endDate = new Date(today);

}]);
