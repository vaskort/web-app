(function(){

  var app = angular.module('app', ['satellizer']);

  app.config(function($authProvider){
    $authProvider.google({
      clientId: 'Google Client ID'
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
