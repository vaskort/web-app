(function(){
  var app = angular.module('app', ['ngRoute', 'directive.g+signin', 'ngAnimate', 'app.activitystore', 'xeditable', 'ngSanitize']);

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
      .when('/activity/:id', {
  			templateUrl: 'templates/activityDetail.html',
  			controller: 'activityDetailCtrl'
  		})
  		.otherwise({
  			redirectTo: '/'
  		});
  });

  app.controller('LoginCtrl', function($scope, $location, $http){

    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
      $location.path('list');
      // apply() fixes a bug maybe that url does not get updated
      $scope.$apply();
    });
    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
      // Auth failure or signout detected
      return;
    });
  });

  app.controller('GoogleCtrl', function($scope, $http, ActivityStore){
    ActivityStore.list().then(function(response){
        // $scope.feed = response;
        console.log(response);

        // bring the first five items
        $scope.feed = response.slice(0,5);

    		$scope.add = function () {
    			// length of the first "short" array
          var length = $scope.feed.length;
          // push five more when load is clicked
    			for (var i = length; i < length + 5; i++) {
    				$scope.feed.push(response[i]);
    			}
    		};

    		$scope.hideButton = function(){
    			// if the length of the short array reaches the original array length then hide the button
    			if ($scope.feed.length === response.length){
    				return true;
    			}
    		}

        // save function that is triggered when you edit the title
        $scope.save = function() {
          ActivityStore.update(response);
        };

      });
  });

  app.controller('activityDetailCtrl', function($scope, $routeParams, ActivityStore) {
  	$scope.name = "activityDetailCtrl";
  	ActivityStore.listItem($routeParams.id).then(function(response){
  		$scope.activityItem = response; //we add activityItem property to scope
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

  // setting xeditable theme
  app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  });

}());
