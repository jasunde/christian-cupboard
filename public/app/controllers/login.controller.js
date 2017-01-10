app.controller('LoginController', ['Auth', '$location', function (Auth, $location) {
  var self = this;

  self.currentUser = Auth.currentUser();

  //runs whenever the user logs in
  self.logIn = function () {
    Auth.logIn().then(function (firebaseUser) {
      self.currentUser = Auth.currentUser();
      $location.path("/foodRescue");
    });
  }
}]);
