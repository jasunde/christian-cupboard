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


  function addDonation(){
    var promise = $http({
      method: 'POST',
      url: '/donations',
      data: self.newDonation,
      header: {
        id_token: Auth.user.idToken
      }
    }).then(function (response) {
      self.newDonation = {};
    });
  }

  function updateDonation(donation) {
    if(Auth.user.idToken) {
      if(verbose){console.log("Editing Donation");}
      $http({
        method: 'PUT',
        url: '/donations',
        data: donation,
        headers: {
          id_token: Auth.user.idToken
        }
      })
      .then(function (result){
        getDonations();
      })
    }
  }
    return {
      addDonation: addDonation,
      getDonations: getDonations,
      updateDonation: updateDonation,
      donations: donations
    };
  }]);
