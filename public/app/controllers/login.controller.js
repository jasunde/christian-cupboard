app.controller('LoginController', ['Auth', '$location', function (Auth, $location) {
  var self = this;

  // self.currentUser = Auth.user.currentUser;

  //runs whenever the user logs in
  self.logIn = function () {
   Auth.logIn()
    .then(function () {
      $location.path('/foodRescue');
    }); 
  }
}]);
