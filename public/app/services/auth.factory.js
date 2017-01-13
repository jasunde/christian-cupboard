app.factory('Auth', ['$firebaseAuth', '$http', 'firebase', '$location', '$rootScope', function AuthFactory($firebaseAuth, $http, firebase, $location, $rootScope) {
  var verbose = false;
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});
  var auth = $firebaseAuth();

  var is_user = false;
  var user = {
    currentUser: null,
    idToken: null
  }


  /**
   * Perform user log-in
   */
  function logIn() {
    return auth.$signInWithPopup(provider)
      .then(function(firebaseUser) {
        if(firebaseUser) {
          is_user = true;
          return firebaseUser.user.getToken()
          .then(function (token) {
            return $http({
              method: 'GET',
              url: '/users/email/' + firebaseUser.user.email,
              headers: {
                id_token: token
              }
            })
              .then(function (result) {
                if(firebaseUser.user.email === result.data.email) {
                  if(verbose) {console.log('logged in');}
                  user.currentUser = firebaseUser.user;
                  user.idToken = token;
                  $rootScope.$broadcast('user:login');
                }
              })
              .catch(function (err) {
                console.log('GET user by email error:', err);
                is_user = false;
              });
          })
          .catch(function (err) {
            console.log('firebase getToken error:', err);
            is_user = false;
          })
      }
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      is_user = false;
    });
  };

  /**
   * Add state change listener to auth
   */
  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      if(!is_user) {
        firebaseUser.getToken()
          .then(function (token) {
            $http({
              method: 'GET',
              url: '/users/email/' + firebaseUser.email,
              headers: {
                id_token: token
              }
            })
              .then(function (result) {
                if(verbose) {console.log('user updated');}
                user.currentUser = firebaseUser;
                user.idToken = token;
                $rootScope.$broadcast('user:updated');
              })
              .catch(function (err) {
                console.log('GET user by email error:', err);
                is_user = false;
              });
          })
          .catch(function (err) {
            console.log('firebase getToken error:', err);
            is_user = false;
          });
      }
    } else {
      user.currentUser = null;
      user.idToken = null;
      is_user = false;
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
    return auth.$signOut()
    .then(function () {
      if(verbose) { console.log('logged out');}
      is_user = false;
      $rootScope.$broadcast('user:logout');
    })
    .catch(function (err) {
      console.log('firebase log out error:', err);
    });
  };

  return {
    logIn: logIn,
    logOut: logOut,
    user: user
  };
}]);
