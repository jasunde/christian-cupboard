app.factory("FoodRescueFactory", ["$http", "Auth", function($http, Auth){

  var categories = {};
  var organizations = undefined;
  var idToken = Auth.idToken;



  function submitDonations(){
    var promise = $http({
      method: 'POST',
      url: '/donations',
      data: self.newDonation,
      header: {
        id_token: idToken
      }
    }).then(function (response) {
      self.newDonation = {};
    })
  }

  //food rescue API
  var foodRescueApi = {
    categories: categories,
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
