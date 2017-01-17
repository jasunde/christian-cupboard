app.factory("ContactsFactory", ["$http", "Auth", function($http, Auth){

  var verbose = false;
  var contacts = {};

  function getContacts(){
    if(verbose){console.log("Token in contact factory", Auth.user.idToken);}
    if(Auth.user.idToken) {
      if(verbose){console.log("Getting Contacts");}
      return $http({
        method: 'GET',
        url: '/contacts',
        headers: {
          id_token: Auth.user.idToken
        }
      })
      .then(function (result) {
        contacts.list = result.data
        if (verbose) {console.log('contacts', contacts.list);}
      })
      .catch(function (err) {
        console.log('GET contacts error:', err);
        contacts.list = null;
      })
    } else {
     if(verbose) {console.log('No token, no contacts!');}
     contacts.list = null;
     }
   }

   return {
     getContacts: getContacts,
     contacts: contacts
   };

}]);
