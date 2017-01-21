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

  return {
    getDistributions: getDistributions,
    addDistribution: addDistribution,
    updateDistribution: updateDistribution,
    distributions: distributions,
    deleteDistribution: deleteDistribution
  };

}]);
