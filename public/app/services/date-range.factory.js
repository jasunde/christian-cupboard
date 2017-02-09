app.factory('DateRangeFactory', ['$rootScope', 'Auth', function($rootScope, Auth) {
  var daterange = {
    start: new Date(),
    end: new Date()
  }

  if(Auth.user) {
    daterange.start = getFilterStartDate(Auth.user.is_admin);
      console.log('daterange', daterange);
  }

  $rootScope.$on('user:updated', function (event, data) {
    if(Auth.user && Auth.user.is_admin) {
      daterange.start = getFilterStartDate(Auth.user.is_admin);
      console.log('daterange', daterange);
    }
  });

  function getFilterStartDate(isAdmin) {
    var start;
    if(isAdmin) {
      start = moment().subtract(2, 'months').toDate();
    } else {
      start = moment().toDate();
    }
    return start;
  }

  function getQueryRange(isAdmin) {
    var queryRange = {};
    if(isAdmin) {
      queryRange = dateRange;
    } else {
      queryRange.start = moment().subtract(1, 'months').toDate();
      queryRange.end = new Date();
    }
    return queryRange;
  }

  return {
    daterange: daterange,
    getQueryRange: getQueryRange
  };
}]);
