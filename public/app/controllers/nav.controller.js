app.controller('NavController', ['Auth', function (Auth) {
  var self = this;

  self.currentUser = Auth.currentUser();
  console.log("Nav Ctrl Say", self.currentUser);

  // self.logOut(){
  //   return auth.$signOut();
  // };

  //runs whenever the user logs in
}]);
