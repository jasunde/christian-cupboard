app.controller('NavController', ['$location', 'Auth', function ($location, Auth) {
  var self = this;
  self.currentUser = Auth.user.currentUser;

// This code runs when the user logs out
  self.logOut = function(){
    Auth.logOut().then(function(){
      $location.path("/login");
    });
  };
}]);
