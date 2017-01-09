app.factory("FoodRescueFactory", ["$http", function($http){

  var categories = undefined;

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

  var foodRescueApi = {
    categories: function(){
      return categories;
    }

  };

  return foodRescueApi;

}]);
