(function() {

  angular.module('app')
    .controller('MessagesController', ['profile', 'channelName', 'messages', MessagesController]);

  function MessagesController(profile, channelName, messages) {
    var messagesCtrl = this;
    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;
    messagesCtrl.message = '';

    messagesCtrl.sendMessage = function() {
      if (messagesCtrl.message.length > 0) {
        messagesCtrl.messages.$add({
          uid: profile.$id,
          body: messagesCtrl.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function() {
          messagesCtrl.message = '';
        });
      }
    };
  }
}());