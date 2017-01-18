app.controller('UserController', ['UserFactory', function (UserFactory) {
  var self = this;

  self.users = UserFactory.users;

  self.add = function () {
    self.newUser.saving = true;

    UserFactory.addUser(self.newUser)
    .then(function (result) {
      self.newUser = {};
      self.newUser.saving = false;
    });
  };

  self.toggleEditable = function (user) {
    if(user.editable) {
      user.editable = false;
    } else {
      user.editable = true;
    }
  };

  self.update = function (user) {
    user.saving = true;

    UserFactory.updateUser(user)
      .then(function (result) {
        user.saving = false;
      });
  };

}]);
