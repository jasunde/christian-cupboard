app.factory("CategoryFactory", ["$http", "Auth", '$rootScope', function ($http, Auth, $rootScope) {
  var verbose = true;
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

  return {
    getCategories: getCategories,
    categories: categories
  };
}]);
