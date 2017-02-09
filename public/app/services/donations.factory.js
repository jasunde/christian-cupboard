app.factory("DonationsFactory", ["$http", "Auth", 'CategoryFactory', 'toastr', function($http, Auth, CategoryFactory, toastr){
 var verbose = false;
 var donations = {
   list: null
 };

  function categoryPropsToObject(donations) {
    donations.list.forEach(function (donation) {
      donation.categories = {}

      for(prop in donation) {

        if(CategoryFactory.categories.map.hasOwnProperty(prop)) {
          if(donation[prop]) {
            donation.categories[CategoryFactory.categories.map[prop]] = parseFloat(donation[prop]);
          }
          delete donation[prop]
        }

      }
    });

    return donations;
  }

 function getDonations(params){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting Donations");}
     return $http({
       method: 'GET',
       url: '/donations',
       headers: {
         id_token: Auth.user.idToken
       },
       params: params
     })
     .then(function (result) {
       donations.list = result.data;
        donations = categoryPropsToObject(donations);
       for (var i = 0; i < donations.list.length; i++) {
         donations.list[i].timestamp = new Date(donations.list[i].timestamp);
       }
       if (verbose) {console.log("data type: ", typeof donations.list[0].timestamp);}
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
        return getDonations()
        .then(function (){
        toastr.success('Donation Submitted');
        })
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
        return getDonations()
        .then(function(){
          toastr.info('Donation Edited');
        })
      })
      .catch(function (err) {
        console.log('POST donation error:', err);
        return err;
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
            return getDonations()
            .then(function(){
              toastr.error('Donation Deleted');
            })
          })
        .catch(function (err) {
          console.log('DELETE donation error:', err);
        });
      }
  }

  function getCsv(params){
    $http({
      method: 'GET',
      url: '/donations/csv',
      dataType: 'text/csv',
      headers: {id_token: Auth.user.idToken},
      params: params
    })
    .then(function(result) {
      // var headers = result.headers()
      var blob = new Blob([result.data], { type: result.config.dataType })
      var windowUrl = (window.URL || window.webkitURL)
      var downloadUrl = windowUrl.createObjectURL(blob)
      var anchor = document.createElement("a")
      anchor.href = downloadUrl
      // var fileNamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      // anchor.download = fileNamePattern.exec(headers['content-disposition'])[1]
      anchor.download = "donations.csv"
      document.body.appendChild(anchor)
      anchor.click()
      windowUrl.revokeObjectURL(blob)

    })
    .catch(function (err) {
      console.log('GET csv error:', err)
    });
  }

  return {
    getDonations: getDonations,
    donations: donations,
    submitDonations: submitDonations,
    editDonations: editDonations,
    deleteDonations: deleteDonations,
    getCsv: getCsv
  };

}]);
