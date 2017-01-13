app.factory("CategoryFactory", ["$http", "Auth", function ($http, Auth) {

  var verbose = true;
  var categories = {
    list: null,
    map: undefined
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
          categories.list = result.data;
          categories.map = categories.list.reduce(function (catMap, category) {
            catMap[category.id] = undefined;
            return catMap;
          }, {});
          if(verbose) {console.log('map', categories.map);}
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
