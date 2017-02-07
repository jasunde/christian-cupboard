app.factory('Auth', ['$firebaseAuth', '$http', 'firebase', '$location', '$rootScope', '$q', function AuthFactory($firebaseAuth, $http, firebase, $location, $rootScope, $q) {
  var verbose = false;
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});
  var auth = $firebaseAuth();
  var displayName = {};

  var is_user = false;
  var user = {
    currentUser: null,
    idToken: null,
    is_admin: false
  }


  /**
   * Perform user log-in
   */
  function logIn() {
    return auth.$signInWithPopup(provider)
      .then(function(firebaseUser) {
        if(firebaseUser) {
          is_user = true;
          return getToken(firebaseUser.user)
          .then(function (token) {
            if(verbose){console.log('token', token);}
            return isUser(firebaseUser.user, token, 'user:login');
          });
      }
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      is_user = false;
    });
  };

  function isUser(firebaseUser, token, event) {
    return $q(function (resolve, reject) {
      $http({
      method: 'GET',
      url: '/users/email/' + firebaseUser.email,
      headers: {
        id_token: token
      }
    })
      .then(function (result) {
        if(firebaseUser.email === result.data.email) {
          if(verbose) {console.log('logged in');}
          user.currentUser = firebaseUser;
          user.idToken = token;
          user.is_admin = result.data.is_admin;
          $rootScope.$broadcast(event);
          resolve();
        } else {
          logOut();
          reject();
        }
      })
      .catch(function (err) {
        console.log('GET user by email error:', err);
        is_user = false;
        logOut();
        reject();
      });
    });
  }

  function getToken(firebaseUser) {
    return $q(function (resolve, reject) {
      firebaseUser.getToken()
        .then(function (token) {
          resolve(token);
        })
        .catch(function (err) {
          console.log('firebase getToken error:', err);
          logOut();
          is_user = false;
          reject(err);
        });
    })
  }

  /**
   * Add state change listener to auth
   */
  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      displayName.name = firebaseUser.displayName;
      if(!is_user) {
        getToken(firebaseUser)
          .then(function (token) {
            if(verbose){console.log('token', token);}
            isUser(firebaseUser, token, 'user:updated');
          });
      }
    } else {
      user.currentUser = null;
      user.idToken = null;
      user.is_admin = false;
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
    displayName.name = undefined;
    return auth.$signOut()
    .then(function () {
      if(verbose) { console.log('logged out');}
      user.currentUser = null;
      user.idToken = null;
      user.is_admin = false;
      is_user = false;
      $rootScope.$broadcast('user:logout');
    })
    .catch(function (err) {
      console.log('firebase log out error:', err);
    });
  };

  return {
    isUser: isUser,
    getToken: getToken,
    logIn: logIn,
    logOut: logOut,
    user: user,
    displayName: displayName
  };
}]);
