app.controller('loginController', ['Auth', function (Auth) {
  var self = this;

  self.currentUser = Auth.currentUser();

  //runs whenever the user logs in
  self.logIn = function () {
    Auth.logIn().then(function (firebaseUser) {
      self.currentUser = Auth.currentUser();
    });
  }
  self.logOut = Auth.logOut;

}]);
