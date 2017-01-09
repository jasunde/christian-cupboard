app.factory("FoodRescueFactory", ["$http", "Auth", function($http, Auth){

  var categories = undefined;
  var organizations = undefined;
  var idToken = undefined;


  idToken = Auth.idToken();

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

  function getTableOrganizations(){
    var promise = $http({
      method: 'GET',
      url: '/organizations',
      headers: {
        id_token: idToken
      }
    }).then(function(response){
      organizations = response.data;
      return organizations;
    });
    return promise;
  }

  //food rescue API
  var foodRescueApi = {
    categories: function(){
      return categories;
    },
    organizations: function(){
      return organizations;
    },
    getCategories: function(){
      return getTableCategories();
    },
    getOrganizations: function(){
      return getTableOrganizations();
    },

  };

  return foodRescueApi;

}]);
