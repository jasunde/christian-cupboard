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
         id_token: Auth.user.token
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

  return {
    getDonations: getDonations,
    donations: donations
  };
}]);
