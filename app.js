(function() {

  var app = angular.module('app', ['firebase', 'angular-md5', 'ui.router', 'ui.bootstrap', 'angular-loading-bar']);

  app.config(['$logProvider', '$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', function($logProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.includeBar = true;

      $logProvider.debugEnabled(true);

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'home.html',
          controller: 'HomeController',
          controllerAs: 'home',
          resolve: {
            requireNoAuth: function($state, Auth) {
              return Auth.$requireSignIn().then(function(auth) {
                $state.go('channels');
              }, function(error) {
                return;
              });
            }
          }
        })
        .state('login', {
          url: '/login',
          controller: 'AuthController',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/login.html',
          resolve: {
            requireNoAuth: function($state, Auth) {
              return Auth.$requireSignIn().then(function(auth) {
                $state.go('home');
              }, function(error) {
                return;
              });
            }
          }
        })
        .state('register', {
          url: '/register',
          controller: 'AuthController',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/register.html',
          resolve: {
            requireNoAuth: function($state, Auth) {
              return Auth.$requireSignIn().then(function(auth) {
                $state.go('home');
              }, function(error) {
                return;
              });
            }
          }
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'users/profile.html',
          controller: 'ProfileController',
          controllerAs: 'profileCtrl',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireSignIn().catch(function() {
                $state.go('home');
              });
            },
            profile: function(Users, Auth) {
              return Auth.$requireSignIn().then(function(auth) {
                return Users.getProfile(auth.uid).$loaded();
              });
            }
          }
        })
        .state('channels', {
          url: '/channels',
          controller: 'ChannelsController',
          controllerAs: 'channelsCtrl',
          templateUrl: 'channels/index.html',
          resolve: {
            channels: function(Channels) {
              return Channels.$loaded();
            },
            profile: function($state, Auth, Users) {
              return Auth.$requireSignIn().then(function(auth) {
                return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                  if (profile.displayName) {
                    return profile;
                  } else {
                    $state.go('profile');
                  }
                });
              }, function(error) {
                $state.go('home');
              });
            }
          }
        })
        .state('channels.create', {
          url: '/create',
          templateUrl: 'channels/create.html',
          controller: 'ChannelsController',
          controllerAs: 'channelsCtrl'
        })
        .state('channels.messages', {
          url: '/{channelId}/messages',
          templateUrl: 'channels/messages.html',
          controller: 'MessagesController',
          controllerAs: 'messagesCtrl',
          resolve: {
            messages: function($stateParams, Messages) {
              return Messages.forChannel($stateParams.channelId).$loaded();
            },
            channelName: function($stateParams, channels) {
              return '#' + channels.$getRecord($stateParams.channelId).name;
            }
          }
        }).state('channels.direct', {
  url: '/{uid}/messages/direct',
  templateUrl: 'channels/messages.html',
 controller: 'MessagesController',
          controllerAs: 'messagesCtrl',
  resolve: {
    messages: function($stateParams, Messages, profile){
      return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
    },
    channelName: function($stateParams, Users){
      return Users.all.$loaded().then(function(){
        return '@'+Users.getDisplayName($stateParams.uid);
      });
    }
  }
});


      /// Configure the firebase connection
      var config = {
        apiKey: "AIzaSyDsowuc3MaXIKUq-goj4FeGYs2cnw29-vE",
        authDomain: "github-7a3d9.firebaseapp.com",
        databaseURL: "https://github-7a3d9.firebaseio.com",
        storageBucket: "github-7a3d9.appspot.com",
        messagingSenderId: "275343482182"
      };
      firebase.initializeApp(config);

      // authentication firebase https://www.youtube.com/watch?v=hT89vxjB5Ek
    }])
    .constant('FirebaseUrl', 'https://github-7a3d9.firebaseio.com/')
    .constant('MSGURL', 'https://github-7a3d9.firebaseio.com/messages')
    .constant('loginRedirectPath', '/login');

  app.run(['$rootScope', '$log', function($rootScope, $log) {

    //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //
    //    $log.debug('successfully changed states');
    //
    //    $log.debug('event', event);
    //    $log.debug('toState', toState);
    //    $log.debug('toParams', toParams);
    //    $log.debug('fromState', fromState);
    //    $log.debug('fromParams', fromParams);
    //});

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

      $log.error('The requested state was not found: ', unfoundState);

    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      $log.error('An error occurred while changing states: ', error);

      $log.debug('event', event);
      $log.debug('toState', toState);
      $log.debug('toParams', toParams);
      $log.debug('fromState', fromState);
      $log.debug('fromParams', fromParams);
    });

  }]);

}());