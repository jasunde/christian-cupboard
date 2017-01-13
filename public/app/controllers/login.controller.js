app.controller('LoginController', ['Auth', '$location', '$scope', function (Auth, $location, $scope) {
  var self = this;

  // self.currentUser = Auth.user.currentUser;

  //runs whenever the user logs in
  self.logIn = function () {
    Auth.logIn()
    .then(function () {
      if(Auth.user.currentUser) {
        $location.path('/foodRescue');
      }
    })
  }

  // $scope.$on('user:updated', function () {
  //   if(Auth.user.currentUser) {
  //     $location.path('/foodRescue');
  //   }
  // });
}]);
