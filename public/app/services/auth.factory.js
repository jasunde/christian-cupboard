app.factory('Auth', ['$firebaseAuth', '$http', 'firebase', function AuthFactory($firebaseAuth, $http, firebase) {
  var auth = $firebaseAuth();
  var currentUser = null;
  var idToken = null;

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
    // console.log(firebase.auth().currentUser);
    // console.log(firebaseUser);
    if(firebaseUser) {
      currentUser = firebaseUser;
      firebaseUser.getToken()
      .then(function (token) {
        idToken = token;
      })
      .catch(function (err) {
        console.log('firebase getToken error:', err);
      });
    } else {
      console.log('Not logged in or not authorized.');
      currentUser = null;
      idToken = null;
    }
    console.log('currentUser:', currentUser);
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
    currentUser: function () {
      return currentUser;
    },
    idToken: function () {
      return idToken;
    }
  };
}]);
