app.controller("foodRescueController", ["$http", "FoodRescueFactory", function($http, FoodRescueFactory){
  var self = this;
  self.rescueCategories = {};

//get the categories

  function getTableCategories(){
    $http({
        url:
        method:
        headers:
    }).then(function (response) {
      self.rescueCategories = response.data;
    });
  }

}]);
