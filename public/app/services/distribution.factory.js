app.factory("DistributionFactory", ["$http", "Auth", '$q', function($http, Auth, $q){
 var verbose = true;
 var self = this;
 var distributions = {};

 if(Auth.user.idToken) {
   getDistributions();
 }

 function getDistributions(){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting distributions");}
     $http({
       method: 'GET',
       url: '/distributions',
       headers: {
         id_token: Auth.user.idToken
       }
     })
     .then(function (result) {
       distributions.list = result.data
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

  function submitDistribution(distribution) {
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
          getDistributions();
          resolve(result);
        })
        .catch(function (err) {
          console.log('POST category error:', err);
          reject();
        });
      } else {
        reject();
      }
    });
  }

  return {
    getDistributions: getDistributions,
    distributions: distributions
  };

}]);
