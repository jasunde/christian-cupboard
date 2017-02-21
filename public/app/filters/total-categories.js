app.filter('mergeCategories', function () {
  return function (items) {
    var totals = {};
    if(items) {
      angular.forEach(items, function (item) {
        var categories = Object.keys(item.categories);
        categories.forEach(function (category) {
          if(totals[category]) {
           totals[category] += item.categories[category];
          } else {
            totals[category] = item.categories[category];
          }
        });
      });
    }
    return totals;
  };
});
