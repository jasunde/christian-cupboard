app.factory("DistributionFactory", ["$http", "Auth", '$q', function($http, Auth, $q){
 var verbose = false;
 var self = this;
 var distributions = {
   list: null
 };

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
                resolve(result)
              })
              .catch(function (err) {
                console.log('GET distributions error:', err);
                reject(err)
              });
          })
        .catch(function (err) {
          console.log('PUT user error:', err);
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
            getDistributions()
            .then(function (result) {
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
      // var headers = result.headers()
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
