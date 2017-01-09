var app = angular.module("christianCupboard", ["ngRoute"]);

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/templates/login.html',
    controller: 'LoginController',
    controllerAs: 'lc',
  })
  .when('/foodRescue', {
    templateUrl: '/views/templates/foodRescue.html',
    controller: 'FoodRescueController',
    controllerAs: 'frc',
  })
  .otherwise({
    redirectTo: 'login',
  });
}]);
