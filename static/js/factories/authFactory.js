/**
 * Created by ulrike on 08.02.17.
 */

myApp.factory('AuthService',
  ['$q', '$timeout', '$http', 'loggedInUser',
  function ($q, $timeout, $http, loggedInUser) {

    // create user variable
    var user = false;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus
    });

    function isLoggedIn() {
      return !!user;
    }

    function login(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/users/', {email: email, password: password})
        // handle success
        .success(function (data, status) {

          console.log("The user has entered data and a HTTP call was made...");

          if(status === 200 && data[0].result){
            user = true;

            loggedInUser.setUserId(data[1].userId);

            console.log("HTTP call 200 and verification okay.. we just set the loggedInUser-ID to .." +
              loggedInUser.getUserId() + " and we set the user to" + user);

            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      loggedInUser.setUserId("");

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout/')
        // handle success
        .success(function (data) {
          user = false;

          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(registerData) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register/', registerData)
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function getUserStatus() {
      return $http.get('/api/status/')
      // handle success

      .success(function (data) {

           console.log("We just made the HTTP call and got the UserStatus: " + data[0].status + "and Id " + data[1].userId);

        if(data[0].status){
          user = true;
          loggedInUser.setUserId(data[1].userId);


        } else {
          user = false;
        }
      }


      )
      // handle error
      .error(function (data) {
        user = false;
      });


    }




}]);
