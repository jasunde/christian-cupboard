app.factory("CategoryFactory", ["$http", "Auth", function ($http, Auth) {
  var verbose = false;
  var categories = {
    list: null
  };

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
          if(verbose) {console.log('list', categories.list);}
          categories.list = result.data;
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

  return {
    getCategories: getCategories,
    categories: categories
  };
}]);
