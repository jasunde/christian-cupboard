app.filter('dateRange', function() {



  return function(date, startDate, endDate){
    var filteredDates = [];
    angular.forEach(date, function(date){
      console.log(date.timestamp);
      if(moment(date.timestamp).isBetween(startDate, endDate, 'day', '[]'))

      {
        filteredDates.push(date)
      }
    })
    console.log(filteredDates);
    //return a boolean that says whether or not this is between the startDate and endDate
    return filteredDates;
  }
});

// startDate.valueOf() <= date.timestamp.valueOf() && date.timestamp.valueOf() <= endDate.valueOf()
