app.factory("ContactsFactory", ["$http", "Auth", '$q', 'toastr', function($http, Auth, $q, toastr){

  var verbose = false;
  var contacts = {};

  // getContacts();

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
            contacts.list = result.data;
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

  function getNonClients(){
    if(verbose){console.log("Token in contact factory", Auth.user.idToken);}
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        if(verbose){console.log("Getting Contacts");}
        return $http({
          method: 'GET',
          url: '/contacts/non-clients',
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result) {
            contacts.list = result.data;
            if (verbose) {console.log('contacts', contacts.list);}
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET non-client contacts error:', err);
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

  function addContact(contact) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'POST',
          url: '/contacts',
          data: contact,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          console.log('Added contact', result);
          getNonClients()
          .then(function(){
              toastr.sucess('Contact Added');
            })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET contacts error:', err);
            reject(err);
          });
        })
        .catch(function (err) {
          console.log('POST contact error:', err);
          reject(err);
        });
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
          getNonClients()
          .then(function(){
              toastr.info('Contact Updated');
            })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET contacts error:', err);
            reject(err);
          });
        })
        .catch(function (err) {
          console.log('PUT contact error:', err);
          reject(err);
        });
      }
    });
  }


     function getCsv(){
       $http({
         method: 'GET',
         url: '/contacts/csvtest',
         dataType: "text/csv",
         headers: {id_token: Auth.user.idToken}
       })
       .then(function(result) {
         console.log(result);
         // var headers = result.headers()
         var blob = new Blob([result.data], { type: result.config.dataType });
         var windowUrl = (window.URL || window.webkitURL);
         var downloadUrl = windowUrl.createObjectURL(blob);
         var anchor = document.createElement("a");
         anchor.href = downloadUrl;
         // var fileNamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
         // anchor.download = fileNamePattern.exec(headers['content-disposition'])[1]
         anchor.download = "contacts.csv";
         document.body.appendChild(anchor);
         anchor.click();
         windowUrl.revokeObjectURL(blob);

       });
     }

   return {
     addContact: addContact,
     getContacts: getContacts,
     getNonClients: getNonClients,
     contacts: contacts,
     updateContact: updateContact,
     getCsv: getCsv
   };

}]);
