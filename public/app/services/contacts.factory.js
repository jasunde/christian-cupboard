app.factory("ContactsFactory", ["$http", "Auth", '$q', function($http, Auth, $q){

  var verbose = true;
  var contacts = {};

  getContacts();

  function getContacts(){
    if(verbose){console.log("Token in contact factory", Auth.user.idToken);}
    return $q(function (resolve, reject) {
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
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET contacts error:', err);
            contacts.list = null;
            reject(err);
          });
      } else {
        if(verbose) {console.log('No token, no contacts!');}
        contacts.list = null;
        reject();
      }
    });
   }

  function updateContact(contact) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'PUT',
          url: '/contacts',
          data: contact,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          console.log('updated contact', result);
          getContacts()
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET contacts error:', err);
            reject(err);
          })
        })
        .catch(function (err) {
          console.log('PUT contact error:', err);
          reject(err);
        });
      }
    });
  }

   return {
     getContacts: getContacts,
     contacts: contacts,
     updateContact: updateContact
   };

}]);
