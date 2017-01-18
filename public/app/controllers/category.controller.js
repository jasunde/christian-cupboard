app.controller('CategoryController', ['$scope', 'Auth', 'CategoryFactory', '$timeout', '$http', function ($scope, Auth, CategoryFactory, $timeout, $http) {
  console.log('Category Controller Running');

  var self = this;

  self.categories = CategoryFactory.categories;

  self.add = function () {
    self.newCategory.saving = true;

    CategoryFactory.addCategory(self.newCategory)
    .then(function (result) {
      self.newCategory = {};
      self.newCategory.saving = false;
    });
  };

  self.update = function (category) {
    category.saving = true;

    CategoryFactory.updateCategory(category)
    .then(function (result) {
      category.saving = false;
    });
  };

  self.toggleEditable = function (category) {
    if(category.editable) {
      category.editable = false;
    } else {
      category.editable = true;
    }
  };

  // TODO: connect to category delete once it's made
  self.delete = function (category) {
    category.saving = true;

    $timeout(function () {
      category.saving = false;
    }, 2000);
    // CategoryFactory.deleteCategory(category)
    // .then(function (result) {
    //   category.saving = false;
    // })
  };

  self.getCsv = function() {
    $http({
      method: 'GET',
      url: '/contacts/csvtest',
      dataType: "text/csv",
      headers: {id_token: Auth.user.idToken}
    })
    .then(function(result) {
      console.log(result);
      // var headers = result.headers()
      var blob = new Blob([result.data], { type: result.config.dataType })
      var windowUrl = (window.URL || window.webkitURL)
      var downloadUrl = windowUrl.createObjectURL(blob)
      var anchor = document.createElement("a")
      anchor.href = downloadUrl
      // var fileNamePattern = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      // anchor.download = fileNamePattern.exec(headers['content-disposition'])[1]
      anchor.download = "contacts.csv"
      document.body.appendChild(anchor)
      anchor.click()
      windowUrl.revokeObjectURL(blob)

    })
  }

}]);
