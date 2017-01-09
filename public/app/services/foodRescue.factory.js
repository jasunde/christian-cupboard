app.factory("FoodRescueFactory", ["$http", function($http){

  var categories = undefined;

  //categories get request
  function getTableCategories(){
    var promise = $http({
      method: 'GET',
      url: '/categories',
      headers: {
        id_token: idToken
      }
    }).then(function(response){
      categories = response.data;
      return categories;
    });
    return promise;
  }

  //food rescue API
  var foodRescueApi = {
    categories: function(){
      return categories;
    },
    getCategories: function(){
      return getTableCategories();
    }

  };

  return foodRescueApi;

}]);
