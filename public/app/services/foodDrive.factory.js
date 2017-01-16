app.factory("FoodDriveFactory", ["$http", "Auth", "$q", function($http, Auth, $q){
  var donations = {
    list: null
  };
  var verbose = true;
    var idToken = undefined;

 function getDonations(){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting Donations");}
     $http({
       method: 'GET',
       url: '/donations',
       headers: {
         id_token: Auth.user.idToken
       }
     })
     .then(function (result) {
       donations.list = result.data;
       if (verbose) {console.log('donations', donations.list);}
     })
     .catch(function (err) {
       console.log('GET donations error:', err);
       donations.list = null;
     });
   } else {
    if(verbose) {console.log('No token, no donations!');}
    donations.list = null;
    }
  }


    function addDonation(donation) {
      return $q(function (resolve, reject) {
      if(Auth.user.is_admin) {
          return $http({
            method: 'POST',
            url: '/donations',
            data: donation,
            headers: {
              id_token: Auth.user.idToken
            }
          })
          .then(function (result) {
            getDonations()
            .then(function (result) {
              resolve(result);
            })
            .catch(function (err) {
              console.log('GET donations error:', err);
              reject();
            });
          })
          .catch(function (err) {
            console.log('POST donations error:', err);
            reject();
          });
        } else {
          reject();
        }
      });
    }

    function updateDonation(donation) {
      return $q(function (resolve, reject) {
        if(Auth.user.is_admin) {
          return $http({
            method: 'PUT',
            url: '/donations',
            data: donation,
            headers: {
              id_token: Auth.user.idToken
            }
          })
          .then(function (result) {
            getDonations()
            .then(function (result) {
              resolve(result);
            })
            .catch(function (err) {
              console.log('GET donations error:', err);
              reject();
            });
          })
          .catch(function (err) {
            console.log('PUT donation error:', err);
            reject();
          });
        } else {
          reject();
        }
      });
    }

    return {
      addDonation: addDonation,
      getDonations: getDonations,
      updateDonation: updateDonation,
      donations: donations
    };
  }]);
