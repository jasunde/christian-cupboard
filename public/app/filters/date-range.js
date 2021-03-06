app.filter('dateRange', function() {

  return function(entries, dateProp, startDate, endDate){
    var filteredDates = [];
    angular.forEach(entries, function(entry){
      if(entry[dateProp]) {
        if(moment(entry[dateProp]).isBetween(startDate, endDate, 'day', '[]')) {
          filteredDates.push(entry);
        }
      }
    });
    //return a boolean that says whether or not this is between the startDate and endDate
    return filteredDates;
  };
});

// startDate.valueOf() <= date.timestamp.valueOf() && date.timestamp.valueOf() <= endDate.valueOf()
