app.controller('ContactController', ['Auth', 'ContactsFactory', '$scope', function (Auth, ContactsFactory, $scope) {
  var self = this;

  self.contacts = ContactsFactory.contacts;

  $scope.$on('user:updated', function () {
    ContactsFactory.getContacts();
  });
}]);
