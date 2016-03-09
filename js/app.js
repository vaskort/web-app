(function(){
  var app = angular.module('app', ['ngRoute', 'directive.g+signin', 'ngAnimate']);

  app.config(function($routeProvider) {
  	$routeProvider
  		.when('/', {
  			templateUrl: 'templates/login.html',
  			controller: 'LoginCtrl'
  		})
  		.when('/list', {
  			templateUrl: 'templates/list.html',
  			controller: 'GoogleCtrl'
  		})
      .when('/post/:id', {
  			templateUrl: 'templates/postDetail.html',
  			controller: 'postDetailCtrl'
  		})
  		.otherwise({
  			redirectTo: '/'
  		});
  });

  app.controller('LoginCtrl', function($scope, $location, $http){

    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
      $location.path('list');
      // apply() fixes that url is not changed
      $scope.$apply();
    });
    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
      // Auth failure or signout detected
    });
  });

  app.controller('GoogleCtrl', function($scope, $http){
    $http.get('https://www.googleapis.com/plus/v1/people/%2Bbusuu/activities/public?key=AIzaSyC2e1nGsZYDOQF8_FrOGddwEgd6T0BAvUg')
      .success(function(response){
        $scope.feed = response;
        $scope.feed = $scope.feedOriginal = $scope.feed.items;
        console.log($scope.feed);
        $scope.feed = $scope.feed.slice(0,5);

    		$scope.add = function () {
    			// length of the first "short" array
    			var itemsLength = $scope.feed.length;
    			// length of the original array
    			var itemsNewLength = $scope.feed.length + 5;
    			for (var i = itemsLength; i < itemsNewLength; i++) {
    				$scope.feed.push($scope.feedOriginal[i]);
    			}
    		};
        
    		$scope.hideButton = function(){
    			// if the length of the short array reaches the original array length then hide the button
    			if ($scope.feed.length === $scope.feedOriginal.length){
    				return true;
    			}
    		}
      });
  });

  app.controller('postDetailCtrl', function($scope, $routeParams, $controller, GoogleCtrl) {
  	$scope.name = "postDetailCtrl";
  	GoogleCtrl.get($routeParams.id).then(function(data){//we give the id from routeparams to get functon from frickrservice above so we can have returned the object we are looking for
  		$scope.postItem = data; //we add photoitem property to scope
  	});
  });

  // background image directive
  app.directive('bgImg', function(){
  	return function(scope, element, attrs){
  		var url = attrs.bgImg;
  		element.css({
  			'background-image':'url('+url+')',
  			'background-size':'cover'
  		});
  	};
  });

  // date filter founded it on the web and modified a bit, it adds date suffixes after the day
  app.filter('dateSuffix', function($filter) {
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
    	if (!input || !input.length) { return; }
      var dtfilter = $filter('date')(input, 'dd');
      var dtfilter2 = $filter('date')(input, ' MMM');
      var dtfilter3 = $filter('date')(input, ' yyyy');
      var dtfilter4 = $filter('date')(input, ' hh:mm');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return dtfilter+suffix+dtfilter2+dtfilter3+" at"+dtfilter4;
    };
  });

}());
