var app = angular.module("christianCupboard", ["ngRoute", "firebase", "wt.responsive", 'ui.bootstrap']);

var redirect = {
  // controller will not be loaded until $requireSignIn resolves
  // Auth refers to our $firebaseAuth wrapper in the factory below
  "currentAuth": ["FireAuth", function(FireAuth) {
    // $requireSignIn returns a promise so the resolve waits for it to complete
    // If the promise is rejected, it will throw a $stateChangeError (see above)
    // return FireAuth.$requireSignIn();
    return FireAuth.$requireSignIn();
  }]
};

var authorized = {
  "admin": ["FireAuth", 'Auth', '$q', function (FireAuth, Auth, $q) {
    return $q(function (resolve, reject) {
      if(Auth.user.is_admin) {
        resolve()
      } else {
        return FireAuth.$requireSignIn()
        .then(function (firebaseUser) {
          Auth.getToken(firebaseUser)
          .then(function (token) {
            Auth.isUser(firebaseUser, token, 'user:updated')
              .then(function (result) {
                if(Auth.user.is_admin) {
                  resolve()
                } else {
                  reject("ADMIN_REQUIRED")
                }
              })
              .catch(function (err) {
                reject("ADMIN_REQUIRED");
              });
          })
          .catch(function (err) {
            reject("AUTH_REQUIRED")
          })
        })
        .catch(function (err) {
          reject("AUTH_REQUIRED");
        });
      }
    });
  }]
};

app.run(['$rootScope', '$location', function ($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
    if(error === "ADMIN_REQUIRED") {
      $location.path("/foodRescue");
    }
  });
}]);

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
    resolve: redirect
  })
  .when('/foodDrive', {
    templateUrl: '/views/templates/foodDrive.html',
    controller: 'FoodDriveController',
    controllerAs: 'fdc',
    resolve: redirect
  })
  .when('/dailyDistribution', {
    templateUrl: '/views/templates/dailyDistribution.html',
    controller: 'DailyDistributionController',
    controllerAs: 'ddc',
    resolve: redirect
  })
  .when('/subDistribution', {
    templateUrl: '/views/templates/subDistribution.html',
    controller: 'SubDistributionController',
    controllerAs: 'sdc',
    resolve: redirect
  })
  .when('/categories', {
    templateUrl: '/views/templates/categories.html',
    controller: 'CategoryController',
    controllerAs: 'cc',
    resolve: authorized
  })
  .when('/users', {
    templateUrl: '/views/templates/users.html',
    controller: 'UserController',
    controllerAs: 'uc',
    resolve: authorized
  })
  .when('/contacts', {
    templateUrl: '/views/templates/contacts.html',
    controller: 'ContactController',
    controllerAs: 'cc',
    resolve: authorized
  })
  .otherwise({
    redirectTo: 'login',
  });
}]);
