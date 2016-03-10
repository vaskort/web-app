angular.module('app.activitystore', [])
	.factory('ActivityStore', function($http) {

    var apiUrl = 'https://www.googleapis.com/plus/v1/people/%2Bbusuu/activities/public?key=';
    var apiKey = 'AIzaSyC2e1nGsZYDOQF8_FrOGddwEgd6T0BAvUg';

    function persist() {
      window.localStorage['activities'] = angular.toJson(activities);
    }

    function giveActivities() {
      return angular.fromJson(window.localStorage['activities'] || $http.get(apiUrl + apiKey));
    }

	  return {

	    list: function() {
	      return giveActivities().then(function(response) {
	      	return response.data;
	      });
	    },

      update: function(item) {
        persist();
	    }

    };
	});
