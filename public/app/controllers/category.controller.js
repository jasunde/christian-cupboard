app.controller('CategoryController', ['$scope', 'Auth', 'CategoryFactory', '$timeout', function ($scope, Auth, CategoryFactory, $timeout) {
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

}]);
