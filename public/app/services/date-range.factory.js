app.factory('DateRangeFactory', ['$rootScope', 'Auth', function($rootScope, Auth) {
  var daterange = {
    start: new Date(),
    end: new Date()
  };

  if(Auth.user) {
    init();
  }

  $rootScope.$on('user:updated', function (event, data) {
    console.log('user updated');
    init();
  });

  $rootScope.$on('user:login', function (event, data) {
    console.log('user login');
    init();
  });

  function init() {
    if(Auth.user) {
      daterange.start = getFilterStartDate(Auth.user.is_admin);
    }
  }

  function getFilterStartDate() {
    var start;
    if(Auth.user.is_admin) {
      start = moment().subtract(2, 'months').toDate();
    } else {
      start = moment().toDate();
    }
    return start;
  }

  function getQueryRange() {
    var queryRange = {};
    if(Auth.user.is_admin) {
      queryRange = daterange;
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
