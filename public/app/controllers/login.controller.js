app.controller('loginController', ['User', function (User) {
  var self = this;

  self.currentUser = User.currentUser();
  //runs whenever the user logs in
  self.logIn = User.logIn;

  User.onChange(function() {
    self.currentUser = User.currentUser();
    console.log(User.currentUser());
  });

  self.logOut = User.logOut;

}]);
