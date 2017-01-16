app.factory("DistributionFactory", ["$http", "Auth", function($http, Auth){
 var verbose = true;
 var self = this;
 var distributions = {};

 function getDistributions(){
   if(Auth.user.idToken) {
     if(verbose){console.log("Getting Donations");}
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

  return {
    getDistributions: getDistributions,
    distributions: distributions
  };

}]);
