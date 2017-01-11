app.factory("CategoryFactory", ["$http", "Auth", function ($http, Auth) {

  var categories = {
    list: null
  };

  function getCategories() {
    if(Auth.idToken()) {
      $http({
        method: 'GET',
        url: '/categories',
        headers: {
          id_token: Auth.idToken()
        }
      })
        .then(function (result) {
          categories.list = result.data;
          console.log('list', categories.list);
        })
        .catch(function (err) {
          console.log('GET categories error:', err);
          categories.list = null;
        })
    } else {
      categories.list = null;
    }
  }

  return {
    getCategories: getCategories,
    categories: categories
  };
}]);
