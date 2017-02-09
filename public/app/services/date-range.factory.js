app.factory('DateRangeFactory', ['$rootScope', 'Auth', function($rootScope, Auth) {
  var daterange = {
    start: new Date(),
    end: new Date()
  }

  if(Auth.user) {
    daterange.start = pickStartDate(Auth.user.is_admin);
  }

  $rootScope.$on('user:updated', function (event, data) {
    if(Auth.user && Auth.user.is_admin) {
      daterange.start = pickStartDate(Auth.user.is_admin);
    }
  });

  function pickStartDate(isAdmin) {
    var monthsPrior = 0;
    if(isAdmin) {
      monthsPrior = 2;
    } else {
      monthsPrior = 1;
    }
    return moment().subtract(monthsPrior, 'months').toDate();
  }

  function setStartDate(isAdmin) {
    daterange.start = pickStartDate(isAdmin);
  }

  return {
    daterange: daterange
  };
}]);
