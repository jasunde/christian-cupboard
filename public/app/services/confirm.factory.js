app.factory('ConfirmFactory', ['$uibModal', function ($uibModal) {
  function confirm(size, config) {
    return $uibModal.open({
      animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '/views/modals/confirmModal.html',
      controller: 'ConfirmCtrl',
      controllerAs: '$ctrl',
      size: size,
      resolve: {
        config: function () {
          return config;
        },
      }
    });
  }

    return {
      confirm: confirm
    };
}]);

app.controller('ConfirmCtrl', function ($uibModalInstance, config) {
  var $ctrl = this;
  $ctrl.action = config.action;
  $ctrl.item = config.item;
  $ctrl.type = config.type;

  $ctrl.accept = function () {
    $uibModalInstance.close(config);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
