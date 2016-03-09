(function(){
  var app = angular.module('app', ['satellizer', 'ngRoute']);

  app.config(function($routeProvider) {
  	$routeProvider
  		.when('/', {
  			templateUrl: 'templates/login.html',
  			controller: 'LoginCtrl'
  		})
  		.when('/list', {
  			templateUrl: 'list.html',
  			controller: 'flikrPhotoCtrl'
  		})
  		.otherwise({
  			redirectTo: '/'
  		});
  });

  app.config(function($authProvider){
    $authProvider.google({
      clientId: '620922501017-k0peditgs1h127do9r2d7ngqacio1nr8.apps.googleusercontent.com'
    });
  });

  app.controller('LoginCtrl', function($scope, $auth){
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
  });

  app.controller('GoogleCtrl', function($scope, $http){
    $http.get('https://www.googleapis.com/plus/v1/people/+busuu/activities/public')
      .success(function(response){
        $scope.feed = response;
        console.log($scope.feed);
      });
  });

}());
