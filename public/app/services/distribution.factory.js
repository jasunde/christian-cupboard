<<<<<<< HEAD
app.factory("DistributionFactory", ["$http", "Auth", '$q', 'CategoryFactory', function($http, Auth, $q, CategoryFactory){
=======
app.factory("DistributionFactory", ["$http", "Auth", '$q', "toastr", function($http, Auth, $q, toastr){
>>>>>>> toasts are working
 var verbose = false;
 var self = this;
 var distributions = {
   list: null
 };

  function categoryPropsToObject(distributions) {
    distributions.list.forEach(function (distribution) {
      distribution.categories = {}
      for(prop in distribution) {
        if(CategoryFactory.categories.map.hasOwnProperty(prop)) {
          if(distribution[prop]) {
            distribution.categories[CategoryFactory.categories.map[prop]] = parseFloat(distribution[prop]);
          }
          delete distribution[prop]
        }
      }
    });
    return distributions;
  }

 function getDistributions(){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting distributions");}
    return $http({
       method: 'GET',
       url: '/distributions',
       headers: {
         id_token: Auth.user.idToken
       }
     })
     .then(function (result) {
       distributions.list = result.data
       distributions = categoryPropsToObject(distributions)
       distributions.list.forEach(function (distribution) {
         distribution.timestamp = new Date(distribution.timestamp);
       });
       if (verbose) {console.log('distributions', distributions.list);}
     })
     .catch(function (err) {
       console.log('GET distributions error:', err);
       distributions.list = null;
     })
   } else {
    if(verbose) {console.log('No token, no distributions!');}
    distributions.list = null;
    }
  }

  function addDistribution(distribution) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        return $http({
          method: 'POST',
          url: '/distributions',
          data: distribution,
          headers: {
            id_token: Auth.user.idToken
          }
        })
        .then(function (result) {
          getDistributions()
          .then(function (result) {
            toastr.success('Distribution Successful');
            resolve(result);
          })
          .catch(function (err) {
            console.log('GET distributions error:', err);
            reject(err)
          });
        })
        .catch(function (err) {
          console.log('POST distribution error:', err);
          reject(err);
        });
      } else {
        reject();
      }
    });
  }

  function updateDistribution(distribution) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        console.log('distribution', distribution);
        return $http({
          method: 'PUT',
          url: '/distributions',
          data: distribution,
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result) {
            getDistributions()
              .then(function (result) {
                toastr.info('Distribution Edited');
                resolve(result)
              })
              .catch(function (err) {
                console.log('GET distributions error:', err);
                reject(err)
              });
          })
        .catch(function (err) {
          console.log('PUT distribution error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  function deleteDistribution(distribution) {
    return $q(function (resolve, reject) {
      if(Auth.user.idToken) {
        console.log('distribution', distribution);
        $http({
          method: 'DELETE',
          url: '/distributions/' + distribution.distribution_id,
          headers: {
            id_token: Auth.user.idToken
          }
        })
          .then(function (result) {
            console.log('getting distributions')
            getDistributions()
            .then(function (result) {
              toastr.error('Distribution Deleted');
              resolve(result);
            })
            .catch(function (err) {
              console.log('GET distributions error:', err);
              reject(err)
            });
          })
          .catch(function (err) {
            console.log('DELETE distribution error:', err);
            reject(err);
          });
      }
    });
  }

  function getCsv(){
    $http({
      method: 'GET',
      url: '/distributions/csvtest',
      dataType: "text/csv",
      headers: {id_token: Auth.user.idToken}
    })
    .then(function(result) {

      console.log(result);
      var headers = result.headers
      var headersArray = []
      for(i = 0; i < headers.length; i++){
        headersArray.push(result.headers);
      }
      var blob = new Blob([result.data], { type: result.config.dataType })
      var windowUrl = (window.URL || window.webkitURL)
      var downloadUrl = windowUrl.createObjectURL(blob)
      var anchor = document.createElement("a")
      anchor.href = downloadUrl
      // var fileNamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      // anchor.download = fileNamePattern.exec(headers['content-disposition'])[1]
      anchor.download = "distributions.csv"
      document.body.appendChild(anchor)
      anchor.click()
      windowUrl.revokeObjectURL(blob)

    })
  }

  return {
    getDistributions: getDistributions,
    addDistribution: addDistribution,
    updateDistribution: updateDistribution,
    distributions: distributions,
    deleteDistribution: deleteDistribution,
    getCsv: getCsv
  };

}]);
