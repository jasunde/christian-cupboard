app.factory("FoodDriveFactory", ["$http", "Auth", function($http, Auth){

  var contacts = undefined;
  var organizations = undefined;
  var idToken = undefined;
  
  
  // idToken = Auth.idToken();
  
  //contacts get request
  function getTableContacts(){
    var promise = $http({
      method: 'GET',
      url: '/contacts',
      headers: {
        id_token: idToken
      }
    }).then(function(response){
      contacts = response.data;
      return contacts;
    });
    return promise;
  }
  
  // function getTableOrganizations(){
  //   var promise = $http({
  //     method: 'GET',
  //     url: '/organizations',
  //     headers: {
  //       id_token: idToken
  //     }
  //   }).then(function(response){
  //     organizations = response.data;
  //     return organizations;
  //   });
  //   return promise;
  // }
  
  //food drive API
  var foodDriveApi = {
    contacts: function(){
      return contacts;
    },
    // organizations: function(){
    //   return organizations;
    // },
    getContacts: function(){
      return getTableContacts();
    },
    // getOrganizations: function(){
    //   return getTableOrganizations();
    // },

  };
  //
  return foodDriveApi;

}]);
