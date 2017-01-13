app.factory("DonationsFactory", ["$http", "Auth", function($http, Auth){
 var verbose = true;
 var donations = {
   list: null
 }

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
       donations.list = result.data
       if (verbose) {console.log('donations', donations.list);}
     })
     .catch(function (err) {
       console.log('GET donations error:', err);
       donations.list = null;
     })
   } else {
    if(verbose) {console.log('No token, no donations!');}
    donations.list = null;
    }
  }

  function submitDonations(newDonation) {
    if(Auth.user.idToken) {
      if(verbose){console.log("Posting Donation");}
      $http({
        method: 'POST',
        url: '/donations',
        data: newDonation,
        headers: {
          id_token: Auth.user.idToken
        }
      })
      .then(function (result){
        getDonations();
      })
    }
  }

  function editDonations() {
    if(Auth.user.idToken) {
      if(verbose){console.log("Editing Donation");}
      $http({
        method: 'PUT',
        url: '/donations',
        data: newDonation,
        headers: {
          id_token: Auth.user.token
        }
      })
      .then(function (result){
        getDonations();
      })
    }
  }

  return {
    getDonations: getDonations,
    donations: donations,
    submitDonations: submitDonations,
    editDonations: editDonations 
  };
}]);
