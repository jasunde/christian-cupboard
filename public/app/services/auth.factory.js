app.factory('Auth', ['$firebaseAuth', '$http', 'firebase', '$location', '$rootScope', function AuthFactory($firebaseAuth, $http, firebase, $location, $rootScope) {
  var auth = $firebaseAuth();
  var currentUser = null;
  var idToken = null;

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
      currentUser = firebaseUser.user;
      return firebaseUser;
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  /**
   * Add state change listener to auth
   */
  auth.$onAuthStateChanged(function(firebaseUser){
    console.log(firebase.auth().currentUser);
    if(firebaseUser) {
      firebaseUser.getToken()
      .then(function (token) {
        idToken = token;
        currentUser = firebaseUser;
        $rootScope.$broadcast('user:updated');
      })
      .catch(function (err) {
        console.log('firebase getToken error:', err);
      });
    } else {
      console.log('Not logged in or not authorized.');
      currentUser = null;
      idToken = null;
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
