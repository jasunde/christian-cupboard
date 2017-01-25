app.controller('NavController', ['$location', 'Auth', function ($location, Auth) {
  var self = this;
  self.currentUser = {};
  self.displayName = {};
  self.message = "Hello World";
  self.user = Auth.user;
  self.displayName = Auth.displayName;

// This code runs when the user logs out
  self.logOut = function(){
    Auth.logOut().then(function(){
      $location.path("/login");

    });
  };
}]);
