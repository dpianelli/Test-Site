(function() {

  angular.module('app')
    .controller('ChannelsController', ['$state', 'Auth', 'Users', 'profile', 'channels', ChannelsController]);

  function ChannelsController($state, Auth, Users, profile, channels) {
    var channelsCtrl = this;
    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;
    channelsCtrl.getDisplayName = Users.getDisplayName;
    channelsCtrl.getGravatar = Users.getGravatar;
    channelsCtrl.users = Users.all;
    channelsCtrl.newChannel = {
      name: ''
    };
    
    Users.setOnline(profile.$id);
    
    channelsCtrl.logout = function() {
      channelsCtrl.profile.online = null;
  channelsCtrl.profile.$save().then(function(){
    Auth.$signOut().then(function(){
      $state.go('home');
    });
  });
    };

    channelsCtrl.createChannel = function() {
      channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref) {
        $state.go('channels.messages', {
          channelId: ref.key
        });
      });
    };
  }
}());