app.factory('UserFactory', ['$http', 'Auth', '$rootScope', '$q', 'toastr', function ($http, Auth, $rootScope, $q, toastr) {
  var users = {
    list: null
  };

  if(Auth.user.is_admin) {
    getUsers();
  }

  $rootScope.$on('user:updated', function () {
    if(Auth.user.is_admin) {
      getUsers();
    }
  });

  function getUsers() {
    return $q(function (resolve, reject) {
      if(Auth.user.is_admin) {
        $http({
          method: 'GET',
          url: '/users',
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result) {
            users.list = result.data;
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET users error:', err);
            users.list = null;
            reject();
          });
      } else {
        users.list = null;
        reject();
      }
    });
  }

  function addUser(user) {
    return $q(function (resolve, reject) {
    if(Auth.user.is_admin) {
        return $http({
          method: 'POST',
          url: '/users',
          data: user,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          getUsers()
          .then(function(){
              toastr.sucess('User Added');
            })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET users error:', err);
            reject();
          });
        })
        .catch(function (err) {
          console.log('POST user error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  function updateUser(user) {
    return $q(function (resolve, reject) {
      if(Auth.user.is_admin) {
        return $http({
          method: 'PUT',
          url: '/users',
          data: user,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          getUsers()
          .then(function(){
              toastr.info('User Updated');
            })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET users error:', err);
            reject();
          });
        })
        .catch(function (err) {
          console.log('PUT user error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  return {
    addUser: addUser,
    getUsers: getUsers,
    updateUser: updateUser,
    users: users
  };
}]);
