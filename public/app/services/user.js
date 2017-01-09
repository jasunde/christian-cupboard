angular.module('secretsApp')
.factory('User', ['Auth', 'Secrets', function UserFactory(Auth, Secrets) {
  var currentUser = null;
  var idToken = null;

  /**
  * Log in a user
  */
  function logIn() {
    return Auth.logIn()
    .then(function (user) {
      currentUser = user;
    });
  };

  /**
  * Log out a user
  */
  function logOut() {
    return Auth.logOut()
    .then(function () {
      currentUser = null;
      idToken = null;
      Secrets.get(null);
    });
  }

  /**
  * Add event listener for user state change
  * @param  {Function} callback To run after user state change
  */
  function onChange(callback) {
    Auth.onChange(function(user) {
      currentUser = user;
    if(currentUser) {
      currentUser.getToken()
      .then(function(token){
        Secrets.get(token)
        .then(function () {
          idToken = token;
          callback();
        });
      })
      .catch(function (err) {
        console.trace('firebaseUser getToken error:', err);
      });
    } else {
      idToken = null;
      callback();
    }
    });
  }

  return {
    currentUser: function () {
      return currentUser;
    },
    idToken: function () {
      return idToken;
    },
    logIn: logIn,
    logOut: logOut,
    onChange: onChange
  };
}]);
