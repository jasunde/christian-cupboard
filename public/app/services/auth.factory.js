app.factory('Auth', ['$firebaseAuth', '$http', 'firebase', '$location', '$rootScope', function AuthFactory($firebaseAuth, $http, firebase, $location, $rootScope) {
  var auth = $firebaseAuth();

  var user = {
    currentUser: null,
    idToken: null
  }

  /**
   * Perform user log-in
   */
  function logIn() {
    return auth.$signInWithPopup("google")
    .then(function(firebaseUser) {
      // console.log('firebaseUser', firebaseUser);
      user.currentUser = firebaseUser.user;
      return firebaseUser;
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  /**
   * Add state change listener to auth
   */
  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      firebaseUser.getToken()
      .then(function (token) {
        user.idToken = token;
        user.currentUser = firebaseUser;
        $rootScope.$broadcast('user:updated');
      })
      .catch(function (err) {
        console.log('firebase getToken error:', err);
      });
    } else {
      user.currentUser = null;
      user.idToken = null;
      $rootScope.$broadcast('user:updated');
    }
  });

  // This code runs when the user logs out
  /**
   * Sign out the user
   */
  /**
   * Sign out the user
   * @param  {Function} callback Callback function
   */
  function logOut(){
    return auth.$signOut();
  };

  return {
    logIn: logIn,
    logOut: logOut,
    user: user
  };
}]);
