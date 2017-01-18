app.factory("DonationsFactory", ["$http", "Auth", function($http, Auth){
 var verbose = false;
 var donations = {
   list: null
 };

 function getDonations(){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting Donations");}
     return $http({
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
     });
   } else {
    if(verbose) {console.log('No token, no donations!');}
    donations.list = null;
    }
  }

  function submitDonations(donation) {
    if(Auth.user.idToken) {
      if(verbose){console.log("Posting Donation", donation);}
      return $http({
        method: 'POST',
        url: '/donations',
        data: donation,
        headers: {
          id_token: Auth.user.idToken
        }
      })
      .then(function (result){
        return getDonations();
      });
    }
  }

  function editDonations(donation) {
    if(Auth.user.idToken) {
      if(verbose){console.log("Editing Donation");}
      return $http({
        method: 'PUT',
        url: '/donations',
        data: donation,
        headers: {
          id_token: Auth.user.idToken
        }
      })
      .then(function (result){
        return getDonations();
      });
    }
  }

  function deleteDonations(donation) {
    console.log('Deleting donation');
      if(Auth.user.idToken) {
        if(verbose){console.log("Deleting Donation", donation.donation_id);}
        return $http({
          method: 'DELETE',
          url: '/donations/' + donation.donation_id,
          data: donation,
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result){
            return getDonations();
          })
        .catch(function (err) {
          console.log('DELETE donation error:', err);
        });
      }
  }

  return {
    getDonations: getDonations,
    donations: donations,
    submitDonations: submitDonations,
    editDonations: editDonations,
    deleteDonations: deleteDonations
  };
}]);
