app.controller('NavController', ["$firebaseAuth", '$location', 'Auth', function ($firebaseAuth, $location, Auth) {
  var auth = $firebaseAuth();
  var self = this;
  self.currentUser = undefined;

  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      self.currentUser = firebaseUser;
      firebaseUser.getToken()
      .then(function (token) {
        idToken = token;
      })
      .catch(function (err) {
        console.log('firebase getToken error:', err);
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.currentUser = null;
      idToken = null;
    }
    console.log('currentUser:', self.currentUser);
  });


// This code runs when the user logs out
  self.logOut = function(){
    auth.$signOut().then(function(){
      self.currentUser = undefined;
      Auth.setUser(undefined);
      $location.path("/login");
    });
  };
}]);
