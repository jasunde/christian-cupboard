app.factory("CategoryFactory", ["$http", "Auth", '$rootScope', '$q', function ($http, Auth, $rootScope, $q) {
  var verbose = false;
  var categories = {
    list: null,
    map: undefined
  };

  if(Auth.user.idToken) {
    getCategories();
  }

  $rootScope.$on('user:updated', function (event, data) {
    if(verbose) {console.log('user update categories');}

    if(Auth.user.currentUser) {
      if(verbose) {console.log('getting categories')}
      getCategories();
    }
  });

  function getCategories() {
    if(Auth.user.idToken) {
      if(verbose) {console.log('getting categories');}
      $http({
        method: 'GET',
        url: '/categories',
        headers: {
          id_token: Auth.user.idToken
        }
      })
        .then(function (result) {
          categories.list = result.data;
          categories.map = categories.list.reduce(function (catMap, category) {
            catMap[category.id] = undefined;
            return catMap;
          }, {});
          if(verbose) {console.log('map', categories.list);}
        })
        .catch(function (err) {
          console.log('GET categories error:', err);
          categories.list = null;
        })
    } else {
      if(verbose) {console.log('Not token, no categories');}
      categories.list = null;
    }
  }

  function addCategory(category) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'POST',
          url: '/categories',
          data: category,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          getCategories();
          resolve(result);
        })
        .catch(function (err) {
          console.log('POST category error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  function updateCategory(category) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'PUT',
          url: '/categories',
          data: category,
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result) {
            getCategories();
            resolve(result);
          })
          .catch(function (err) {
            console.log('PUT category error:', err);
            reject();
          });
      } else {
        reject();
      }
    });
  }

  function deleteCategory(category) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'DELETE',
          url: '/categories' + category.id,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          getCategories();
          resolve();
        })
        .catch(function (err) {
          console.log('DELETE category error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  return {
    addCategory: addCategory,
    categories: categories,
    deleteCategory: deleteCategory,
    getCategories: getCategories,
    updateCategory: updateCategory
  };
}]);
