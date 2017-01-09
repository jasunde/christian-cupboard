var app = angular.module("christianCupboard", ["ngRoute", "firebase"]);

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
  .when('/nav', {
    templateUrl: '/views/templates/nav.html',
    controller: 'NavController',
    controllerAs: 'nc',
  })
  .when('/login', {
    templateUrl: '/views/templates/login.html',
    controller: 'LoginController',
    controllerAs: 'lc',
  })
  .when('/home', {
    templateUrl: '/views/templates/home.html',
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
