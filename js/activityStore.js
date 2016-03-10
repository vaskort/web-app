angular.module('app.activitystore', [])
	.factory('ActivityStore', function($http, $q) {

    var apiUrl = 'https://www.googleapis.com/plus/v1/people/%2Bbusuu/activities/public?key=';
    var apiKey = 'AIzaSyC2e1nGsZYDOQF8_FrOGddwEgd6T0BAvUg';

    function persist(activities) {
      window.localStorage['activities'] = angular.toJson(activities);
    }

	  return {

	    list: function() {

        if (window.localStorage['activities']){
          return $q(function(resolve, reject){
            return resolve(angular.fromJson(window.localStorage['activities']));
          });
        }

	      return $http.get(apiUrl + apiKey).then(function(response) {
          persist(response.data.items);
	      	return response.data.items;
	      });

	    },

      listItem: function(id){
        return this.list().then(function(response){
          console.log(response);
          return _.find(response, 'id', id);
        });
      },

      update: function(item) {
        persist(item);
	    }

    };
	});
