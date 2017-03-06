(function() {

  angular.module('app')
    .factory('Auth', ['$firebaseAuth', Auth]);

  function Auth($firebaseAuth) {
    var auth = $firebaseAuth();

    return auth;
  }
  
}());
