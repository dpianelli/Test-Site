(function() {

  angular.module('app')
    .controller('AuthController', ['Auth', '$state', AuthController]);

  function AuthController(Auth, $state) {
    var authCtrl = this;
    authCtrl.error = '';
    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function() {
      Auth.$signInWithEmailAndPassword(authCtrl.user.email,authCtrl.user.password).then(function(auth) {
        $state.go('home');
      }).catch(function(error) {
        authCtrl.error = error;
      });
    };

    authCtrl.register = function() {
      Auth.$createUserWithEmailAndPassword(authCtrl.user.email,authCtrl.user.password).then(function(user) {
        $state.go('home');
      }).catch(function(error) {
        authCtrl.error = error;
      });
    };

  }

}());
